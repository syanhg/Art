import p5 from 'p5';

/**
 * The generated source is executed in this page (same origin) so that the
 * resulting <canvas> stays readable for PNG export. Model output is still
 * screened for the handful of APIs a drawing sketch has no reason to touch.
 */
const FORBIDDEN = [
  /\bfetch\s*\(/,
  /\bXMLHttpRequest\b/,
  /\bWebSocket\b/,
  /\bEventSource\b/,
  /\bimportScripts\b/,
  /\blocalStorage\b/,
  /\bsessionStorage\b/,
  /\bindexedDB\b/,
  /\bdocument\s*\.\s*cookie\b/,
  /\bnavigator\s*\.\s*sendBeacon\b/,
  /\bimport\s*\(/,
];

export type SketchStatus = 'idle' | 'thinking' | 'rendering' | 'done' | 'error';

export interface SketchHandle {
  instance: p5;
  canvas: HTMLCanvasElement | null;
  pause(): void;
  resume(): void;
  destroy(): void;
}

export interface RunOptions {
  code: string;
  container: HTMLElement;
  /** Called for both compile-time and per-frame runtime failures. */
  onError: (message: string) => void;
  /** Called once the sketch has produced a canvas. */
  onCanvas?: (canvas: HTMLCanvasElement) => void;
}

function describeError(err: unknown): string {
  if (err instanceof Error) return `${err.name}: ${err.message}`;
  return String(err);
}

/** Adds the likely cause to the p5 messages that do not explain themselves. */
function describeRuntimeError(err: unknown, skippedColors: number): string {
  const message = describeError(err);
  const extra: string[] = [];
  if (/valid color representation/i.test(message)) {
    extra.push('A colour argument was undefined or NaN — usually a palette lookup that missed.');
  }
  const undefinedName = /ReferenceError: (\w+) is not defined/.exec(message);
  if (undefinedName) {
    extra.push(
      `The sketch used a bare "${undefinedName[1]}". Instance mode has no p5 globals — it has to be "p.${undefinedName[1]}".`,
    );
  }
  if (skippedColors > 0) {
    extra.push(`${skippedColors} unusable colour call${skippedColors === 1 ? '' : 's'} were skipped before this.`);
  }
  return extra.length ? `${message}\n${extra.join('\n')}` : message;
}

/** Turns the generated source into an instance-mode sketch factory. */
export function compileSketch(code: string): (p: p5) => void {
  for (const pattern of FORBIDDEN) {
    if (pattern.test(code)) {
      throw new Error(`The generated sketch was blocked: it uses a disallowed API (${pattern.source}).`);
    }
  }

  // The bundled p5 is an ES import, never a window global, so sketches that
  // reach for a static such as p5.Vector would hit "p5 is not defined". The
  // constructor is handed in as a parameter instead.
  let factory: (p5Ctor: typeof p5) => unknown;
  try {
    // eslint-disable-next-line no-new-func
    factory = new Function(
      'p5',
      `"use strict";\n${code}\n;return typeof sketch === "function" ? sketch : null;`,
    ) as (p5Ctor: typeof p5) => unknown;
  } catch (err) {
    throw new Error(`The generated sketch has a syntax error. ${describeError(err)}`);
  }

  const fn = factory(p5);
  if (typeof fn !== 'function') {
    throw new Error('The generated code did not define a function named "sketch".');
  }
  return fn as (p: p5) => void;
}

/**
 * p5 throws "[object Arguments] is not a valid color representation" as soon as
 * a colour argument is undefined or NaN — usually a palette index that missed.
 * One bad lookup should not kill the whole page, so colour arguments are
 * cleaned up before they reach p5 and hopeless calls are skipped.
 */
function cleanColorArgs(args: unknown[]): unknown[] | null {
  if (args.length === 0) return null;

  // p5.Color instances and CSS strings pass straight through.
  const first = args[0];
  if (typeof first === 'string') return args;
  if (first && typeof first === 'object' && !Array.isArray(first)) {
    return 'levels' in (first as object) ? args : null;
  }

  const flat: number[] = [];
  for (const arg of Array.isArray(first) && args.length === 1 ? (first as unknown[]) : args) {
    const n = typeof arg === 'number' ? arg : Number(arg);
    if (Number.isFinite(n)) flat.push(n);
  }
  if (flat.length === 0) return null;
  return flat.slice(0, 4);
}

const COLOR_METHODS = ['fill', 'stroke', 'background', 'tint'] as const;

function guardColorMethods(p: p5, onSkip: () => void): void {
  for (const name of COLOR_METHODS) {
    const target = p as unknown as Record<string, (...a: unknown[]) => unknown>;
    const original = target[name];
    if (typeof original !== 'function') continue;
    target[name] = function guardedColor(this: p5, ...args: unknown[]) {
      const clean = cleanColorArgs(args);
      if (!clean) {
        onSkip();
        return undefined;
      }
      return original.apply(this, clean);
    };
  }
}

/** Mounts a compiled sketch into `container`, replacing anything already there. */
export function runSketch({ code, container, onError, onCanvas }: RunOptions): SketchHandle {
  const factory = compileSketch(code);
  container.replaceChildren();

  let failed = false;
  const fail = (err: unknown) => {
    if (failed) return;
    failed = true;
    onError(typeof err === 'string' ? err : describeError(err));
  };

  let skipped = 0;

  const instance = new p5((p: p5) => {
    factory(p);
    guardColorMethods(p, () => {
      skipped++;
    });

    // Guard the lifecycle hooks the sketch just installed so a bad frame
    // surfaces as a message instead of an endless console spew.
    for (const hook of ['setup', 'draw', 'windowResized'] as const) {
      const original = (p as unknown as Record<string, unknown>)[hook];
      if (typeof original !== 'function') continue;
      (p as unknown as Record<string, unknown>)[hook] = function guarded(this: p5, ...args: unknown[]) {
        try {
          return (original as (...a: unknown[]) => unknown).apply(this, args);
        } catch (err) {
          fail(describeRuntimeError(err, skipped));
          try {
            p.noLoop();
          } catch {
            /* the instance may already be torn down */
          }
        }
      };
    }
  }, container);

  const canvas = container.querySelector('canvas');
  if (canvas) onCanvas?.(canvas);

  return {
    instance,
    canvas,
    pause: () => instance.noLoop(),
    resume: () => instance.loop(),
    destroy: () => {
      try {
        instance.remove();
      } catch {
        /* already removed */
      }
      container.replaceChildren();
    },
  };
}

/** Reads the sketch canvas back as a PNG blob. */
export function canvasToPng(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('The canvas could not be encoded as a PNG.'));
    }, 'image/png');
  });
}
