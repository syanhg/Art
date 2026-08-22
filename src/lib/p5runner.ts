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

/**
 * Models sometimes wrap the source in a markdown fence or open with a line of
 * prose. Both are syntax errors, and both are trivially recoverable.
 */
export function sanitizeSketch(raw: string): string {
  let code = raw.trim();
  const fence = code.match(/^```(?:javascript|js)?\s*\n([\s\S]*?)\n?```$/);
  if (fence) code = fence[1].trim();
  const start = code.search(/(?:^|\n)\s*(?:\/\/|\/\*|function\s+sketch\b|const\b|let\b|var\b)/);
  if (start > 0) code = code.slice(start).trim();
  return code;
}

/**
 * Counts brackets outside strings, comments and regexes well enough to tell a
 * response that was cut off mid-structure from one that is merely wrong.
 */
function unclosedDepth(code: string): number {
  let depth = 0;
  let i = 0;
  let quote = '';
  while (i < code.length) {
    const c = code[i];
    const next = code[i + 1];
    if (quote) {
      if (c === '\\') i++;
      else if (c === quote) quote = '';
    } else if (c === '"' || c === "'" || c === '`') {
      quote = c;
    } else if (c === '/' && next === '/') {
      i = code.indexOf('\n', i);
      if (i < 0) break;
    } else if (c === '/' && next === '*') {
      const end = code.indexOf('*/', i + 2);
      i = end < 0 ? code.length : end + 1;
    } else if (c === '{' || c === '[' || c === '(') {
      depth++;
    } else if (c === '}' || c === ']' || c === ')') {
      depth--;
    }
    i++;
  }
  return depth;
}

/** Turns the generated source into an instance-mode sketch factory. */
export function compileSketch(source: string): (p: p5) => void {
  const code = sanitizeSketch(source);

  for (const pattern of FORBIDDEN) {
    if (pattern.test(code)) {
      throw new Error(`The generated sketch was blocked: it uses a disallowed API (${pattern.source}).`);
    }
  }

  let factory: () => unknown;
  try {
    // eslint-disable-next-line no-new-func
    factory = new Function(
      `"use strict";\n${code}\n;return typeof sketch === "function" ? sketch : null;`,
    ) as () => unknown;
  } catch (err) {
    const depth = unclosedDepth(code);
    const tail = code.slice(-160).replace(/\s+/g, ' ');
    const hint =
      depth > 0
        ? `The response looks cut off — ${depth} bracket${depth === 1 ? '' : 's'} were never closed. ` +
          'Generate again, or ask for a shorter page.'
        : 'Check the source in the code pane.';
    throw new Error(
      `The generated sketch has a syntax error. ${describeError(err)}\n${hint}\nThe source ends: …${tail}`,
    );
  }

  const fn = factory();
  if (typeof fn !== 'function') {
    throw new Error('The generated code did not define a function named "sketch".');
  }
  return fn as (p: p5) => void;
}

/** Mounts a compiled sketch into `container`, replacing anything already there. */
export function runSketch({ code, container, onError, onCanvas }: RunOptions): SketchHandle {
  const factory = compileSketch(code);
  container.replaceChildren();

  let failed = false;
  const fail = (err: unknown) => {
    if (failed) return;
    failed = true;
    onError(describeError(err));
  };

  const instance = new p5((p: p5) => {
    factory(p);

    // Guard the lifecycle hooks the sketch just installed so a bad frame
    // surfaces as a message instead of an endless console spew.
    for (const hook of ['setup', 'draw', 'windowResized'] as const) {
      const original = (p as unknown as Record<string, unknown>)[hook];
      if (typeof original !== 'function') continue;
      (p as unknown as Record<string, unknown>)[hook] = function guarded(this: p5, ...args: unknown[]) {
        try {
          return (original as (...a: unknown[]) => unknown).apply(this, args);
        } catch (err) {
          fail(err);
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
