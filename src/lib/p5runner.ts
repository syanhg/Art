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

export type SketchStatus = 'idle' | 'thinking' | 'repairing' | 'rendering' | 'done' | 'error';

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
 * Walks the source outside strings, comments and template literals, matching
 * brackets by kind. Overall counts can balance while a ")" is closed by a "]",
 * which is exactly the failure the parser reports without a line number.
 */
export interface BracketProblem {
  kind: 'mismatch' | 'unclosed';
  line: number;
  column: number;
  found?: string;
  expected?: string;
  text: string;
}

const CLOSERS: Record<string, string> = { ')': '(', ']': '[', '}': '{' };

export function findBracketProblem(code: string): BracketProblem | null {
  const lines = code.split('\n');
  const stack: { char: string; line: number; column: number }[] = [];
  let line = 1;
  let column = 1;
  let quote = '';
  let i = 0;

  const at = (n: number) => (lines[n - 1] ?? '').trim().slice(0, 120);

  while (i < code.length) {
    const c = code[i];
    const next = code[i + 1];
    if (c === '\n') {
      line++;
      column = 0;
    }

    if (quote) {
      if (c === '\\') {
        i += 2;
        column += 2;
        continue;
      }
      if (c === quote) quote = '';
    } else if (c === '"' || c === "'" || c === '`') {
      quote = c;
    } else if (c === '/' && next === '/') {
      const nl = code.indexOf('\n', i);
      if (nl < 0) break;
      i = nl;
      continue;
    } else if (c === '/' && next === '*') {
      const end = code.indexOf('*/', i + 2);
      const skipped = (end < 0 ? code.slice(i) : code.slice(i, end + 2)).split('\n').length - 1;
      line += skipped;
      i = end < 0 ? code.length : end + 2;
      continue;
    } else if (c === '(' || c === '[' || c === '{') {
      stack.push({ char: c, line, column });
    } else if (c === ')' || c === ']' || c === '}') {
      const open = stack.pop();
      if (!open || open.char !== CLOSERS[c]) {
        return {
          kind: 'mismatch',
          line,
          column,
          found: c,
          expected: open ? { '(': ')', '[': ']', '{': '}' }[open.char] : 'nothing',
          text: at(line),
        };
      }
    }

    i++;
    column++;
  }

  const left = stack.pop();
  if (left) {
    return { kind: 'unclosed', line: left.line, column: left.column, found: left.char, text: at(left.line) };
  }
  return null;
}

/** Compiles without mounting, so bad source is caught before it reaches p5. */
export function validateSketch(source: string): string | null {
  try {
    compileSketch(source);
    return null;
  } catch (err) {
    return describeError(err);
  }
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
    const problem = findBracketProblem(code);
    let hint = 'Check the source in the code pane.';
    if (problem?.kind === 'mismatch') {
      hint =
        `Line ${problem.line}: found "${problem.found}" where "${problem.expected}" was expected.\n` +
        `  ${problem.text}`;
    } else if (problem?.kind === 'unclosed') {
      hint =
        `The response looks cut off: "${problem.found}" opened on line ${problem.line} is never closed.\n` +
        `  ${problem.text}`;
    }
    throw new Error(`The generated sketch has a syntax error. ${describeError(err)}\n${hint}`);
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
