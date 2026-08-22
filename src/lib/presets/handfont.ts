/**
 * A stroke-drawn alphabet, inlined into every bundled sketch (they must stay
 * self-contained). Each glyph is a list of pen strokes in a unit box — x right,
 * y down from cap height to baseline — so letters are drawn by the same routine
 * that draws everything else, with wobble, pressure and overshoot, rather than
 * typeset with p.text().
 */
export const HAND_FONT = String.raw`
  // ---- drawn lettering ----------------------------------------------------

  const GLYPHS = {
    A: [[[0, 1], [0.5, 0], [1, 1]], [[0.16, 0.66], [0.84, 0.66]]],
    B: [[[0, 0], [0, 1]], [[0, 0], [0.6, 0.05], [0.76, 0.26], [0.58, 0.46], [0, 0.5]],
        [[0, 0.5], [0.68, 0.56], [0.86, 0.76], [0.66, 0.96], [0, 1]]],
    C: [[[0.95, 0.16], [0.62, 0], [0.26, 0.09], [0.05, 0.36], [0.06, 0.7], [0.28, 0.94], [0.64, 1], [0.96, 0.85]]],
    D: [[[0, 0], [0, 1]], [[0, 0], [0.54, 0.06], [0.86, 0.36], [0.85, 0.68], [0.54, 0.95], [0, 1]]],
    E: [[[0.94, 0], [0, 0], [0, 1], [0.96, 1]], [[0, 0.5], [0.7, 0.5]]],
    F: [[[0.94, 0], [0, 0], [0, 1]], [[0, 0.5], [0.68, 0.5]]],
    G: [[[0.95, 0.16], [0.6, 0], [0.25, 0.09], [0.05, 0.36], [0.06, 0.7], [0.3, 0.95], [0.66, 1], [0.95, 0.82], [0.95, 0.56], [0.56, 0.56]]],
    H: [[[0, 0], [0, 1]], [[1, 0], [1, 1]], [[0, 0.52], [1, 0.52]]],
    I: [[[0.22, 0], [0.78, 0]], [[0.5, 0], [0.5, 1]], [[0.22, 1], [0.78, 1]]],
    J: [[[0.78, 0], [0.76, 0.78], [0.55, 1], [0.24, 0.94], [0.12, 0.72]]],
    K: [[[0, 0], [0, 1]], [[0.92, 0], [0.05, 0.58]], [[0.3, 0.42], [0.96, 1]]],
    L: [[[0, 0], [0, 1], [0.9, 1]]],
    M: [[[0, 1], [0, 0], [0.5, 0.64], [1, 0], [1, 1]]],
    N: [[[0, 1], [0, 0], [1, 1], [1, 0]]],
    O: [[[0.5, 0], [0.16, 0.16], [0.04, 0.5], [0.16, 0.85], [0.5, 1], [0.85, 0.85], [0.97, 0.5], [0.85, 0.16], [0.5, 0]]],
    P: [[[0, 1], [0, 0], [0.66, 0.05], [0.84, 0.28], [0.62, 0.52], [0, 0.56]]],
    Q: [[[0.5, 0], [0.16, 0.16], [0.04, 0.5], [0.16, 0.85], [0.5, 1], [0.85, 0.85], [0.97, 0.5], [0.85, 0.16], [0.5, 0]], [[0.62, 0.74], [1.02, 1.1]]],
    R: [[[0, 1], [0, 0], [0.66, 0.05], [0.84, 0.28], [0.6, 0.52], [0, 0.56]], [[0.48, 0.54], [0.98, 1]]],
    S: [[[0.93, 0.13], [0.6, 0], [0.24, 0.06], [0.1, 0.26], [0.32, 0.45], [0.72, 0.56], [0.9, 0.76], [0.74, 0.96], [0.34, 1], [0.05, 0.86]]],
    T: [[[0, 0], [1, 0]], [[0.5, 0], [0.5, 1]]],
    U: [[[0, 0], [0, 0.72], [0.2, 0.96], [0.5, 1], [0.8, 0.96], [1, 0.72], [1, 0]]],
    V: [[[0, 0], [0.5, 1], [1, 0]]],
    W: [[[0, 0], [0.24, 1], [0.5, 0.36], [0.76, 1], [1, 0]]],
    X: [[[0, 0], [1, 1]], [[1, 0], [0, 1]]],
    Y: [[[0, 0], [0.5, 0.52], [1, 0]], [[0.5, 0.52], [0.5, 1]]],
    Z: [[[0, 0], [1, 0], [0, 1], [1, 1]]],
    '0': [[[0.5, 0], [0.16, 0.2], [0.08, 0.5], [0.16, 0.82], [0.5, 1], [0.84, 0.82], [0.92, 0.5], [0.84, 0.2], [0.5, 0]]],
    '1': [[[0.22, 0.2], [0.54, 0], [0.54, 1]], [[0.24, 1], [0.86, 1]]],
    '2': [[[0.08, 0.2], [0.4, 0], [0.76, 0.09], [0.8, 0.36], [0.1, 1], [0.92, 1]]],
    '3': [[[0.1, 0.1], [0.5, 0], [0.84, 0.16], [0.6, 0.45], [0.3, 0.48]], [[0.6, 0.45], [0.9, 0.7], [0.7, 0.96], [0.3, 1], [0.07, 0.87]]],
    '4': [[[0.72, 0], [0.05, 0.72], [0.98, 0.72]], [[0.72, 0], [0.72, 1]]],
    '5': [[[0.86, 0.02], [0.2, 0.03], [0.15, 0.43], [0.5, 0.36], [0.82, 0.5], [0.86, 0.78], [0.54, 1], [0.14, 0.92]]],
    '6': [[[0.82, 0.06], [0.4, 0.05], [0.14, 0.36], [0.1, 0.76], [0.36, 1], [0.72, 0.95], [0.86, 0.7], [0.6, 0.5], [0.2, 0.55], [0.12, 0.72]]],
    '7': [[[0.05, 0], [0.95, 0], [0.38, 1]]],
    '8': [[[0.5, 0], [0.2, 0.12], [0.26, 0.4], [0.56, 0.52], [0.86, 0.66], [0.8, 0.9], [0.45, 1], [0.14, 0.86], [0.24, 0.62], [0.6, 0.48], [0.82, 0.3], [0.74, 0.08], [0.5, 0]]],
    '9': [[[0.9, 0.36], [0.6, 0.5], [0.25, 0.43], [0.2, 0.16], [0.5, 0.02], [0.82, 0.13], [0.9, 0.46], [0.74, 0.86], [0.4, 1]]],
    '.': [[[0.44, 0.95], [0.56, 1.01]]],
    ',': [[[0.52, 0.9], [0.4, 1.14]]],
    '-': [[[0.08, 0.55], [0.92, 0.55]]],
    '_': [[[0, 1.06], [1, 1.06]]],
    "'": [[[0.5, 0], [0.44, 0.24]]],
    ':': [[[0.44, 0.3], [0.56, 0.36]], [[0.44, 0.94], [0.56, 1]]],
    ';': [[[0.46, 0.3], [0.58, 0.36]], [[0.52, 0.9], [0.4, 1.14]]],
    '?': [[[0.12, 0.2], [0.42, 0], [0.78, 0.14], [0.72, 0.4], [0.46, 0.52], [0.46, 0.7]], [[0.44, 0.95], [0.56, 1.01]]],
    '!': [[[0.5, 0], [0.48, 0.7]], [[0.44, 0.95], [0.56, 1.01]]],
    '/': [[[0.88, 0], [0.12, 1]]],
    '(': [[[0.72, 0], [0.34, 0.3], [0.34, 0.72], [0.72, 1]]],
    ')': [[[0.28, 0], [0.66, 0.3], [0.66, 0.72], [0.28, 1]]],
    '&': [[[0.92, 1], [0.3, 0.44], [0.24, 0.16], [0.5, 0.02], [0.7, 0.2], [0.5, 0.44], [0.14, 0.7], [0.3, 0.98], [0.66, 0.9], [0.92, 0.56]]],
    '+': [[[0.14, 0.55], [0.86, 0.55]], [[0.5, 0.2], [0.5, 0.9]]],
    '=': [[[0.12, 0.42], [0.88, 0.42]], [[0.12, 0.7], [0.88, 0.7]]],
    '*': [[[0.5, 0.1], [0.5, 0.6]], [[0.24, 0.22], [0.76, 0.5]], [[0.76, 0.22], [0.24, 0.5]]],
    '%': [[[0.86, 0.04], [0.14, 1]], [[0.1, 0.06], [0.3, 0.06], [0.3, 0.3], [0.1, 0.3], [0.1, 0.06]], [[0.7, 0.7], [0.9, 0.7], [0.9, 0.96], [0.7, 0.96], [0.7, 0.7]]],
    '>': [[[0.18, 0.16], [0.82, 0.55], [0.18, 0.94]]],
    '<': [[[0.82, 0.16], [0.18, 0.55], [0.82, 0.94]]],
    '#': [[[0.3, 0.06], [0.18, 1]], [[0.7, 0.06], [0.58, 1]], [[0.08, 0.38], [0.9, 0.34]], [[0.06, 0.7], [0.88, 0.66]]],
  };

  // Advance per glyph: M and W need room, I and the punctuation do not.
  const WIDE = 'MW';
  const NARROW = "1.,';:!";
  function advance(ch) {
    if (ch === ' ') return 0.72;
    if (WIDE.indexOf(ch) >= 0) return 1.02;
    if (NARROW.indexOf(ch) >= 0) return 0.46;
    if (ch === 'I') return 0.64;
    return 0.86;
  }

  // One pen stroke: walked in short segments, jittered, pressure heavier through
  // the middle, drawn twice so the ink doubles where the hand went over it.
  function penStroke(pts, size, weight, col, alpha) {
    const passes = weight > 1.6 ? 2 : 1;
    // Wobble is a fraction of cap height: big lettering can be loose, small
    // lettering has to stay tight or it stops being readable.
    const jitter = p.constrain(size * 0.022, 0.12, 0.75);
    const step = p.constrain(size * 0.14, 1.2, 3);
    for (let pass = 0; pass < passes; pass++) {
      const wob = pass === 0 ? 1 : 0.55;
      for (let i = 0; i < pts.length - 1; i++) {
        const ax = pts[i][0] * size;
        const ay = (pts[i][1] - 1) * size;
        const bx = pts[i + 1][0] * size;
        const by = (pts[i + 1][1] - 1) * size;
        const steps = p.max(2, p.ceil(p.dist(ax, ay, bx, by) / step));
        for (let s = 0; s < steps; s++) {
          const t0 = s / steps;
          const t1 = (s + 1) / steps;
          const along = (i + t0) / p.max(1, pts.length - 1);
          const press = 0.5 + p.sin(along * p.PI) * 0.7;
          p.stroke(col[0], col[1], col[2], alpha * p.random(0.7, 1));
          p.strokeWeight(weight * press * p.random(0.8, 1.25));
          p.line(
            p.lerp(ax, bx, t0) + p.random(-jitter, jitter) * wob,
            p.lerp(ay, by, t0) + p.random(-jitter, jitter) * wob,
            p.lerp(ax, bx, t1) + p.random(-jitter, jitter) * wob,
            p.lerp(ay, by, t1) + p.random(-jitter, jitter) * wob,
          );
        }
      }
      // The pen overshoots a little where it lifts off.
      const n = pts.length;
      if (n > 1 && p.random() < 0.55) {
        const ex = pts[n - 1][0] * size;
        const ey = (pts[n - 1][1] - 1) * size;
        const dx = ex - pts[n - 2][0] * size;
        const dy = ey - (pts[n - 2][1] - 1) * size;
        const d = p.max(0.001, p.sqrt(dx * dx + dy * dy));
        const over = p.random(0.5, 1) * p.constrain(size * 0.1, 0.8, 3);
        p.strokeWeight(weight * 0.6);
        p.line(ex, ey, ex + (dx / d) * over, ey + (dy / d) * over);
      }
    }
  }

  // Draw a string as letterforms. x is the left edge, y the baseline.
  function handText(str, x, y, size, col, alpha, weight) {
    const w = weight || p.max(1.1, size * 0.1);
    const slant = p.random(-0.01, 0.01);
    const drift = p.random(-0.35, 0.35);
    const shake = p.constrain(size * 0.02, 0.15, 0.7);
    let cx = x;
    for (let i = 0; i < str.length; i++) {
      const ch = str[i].toUpperCase();
      const strokes = GLYPHS[ch];
      if (strokes) {
        p.push();
        p.translate(cx, y + drift * i * 0.05 + p.random(-shake, shake));
        p.rotate(slant + p.random(-0.016, 0.016));
        for (const s of strokes) penStroke(s, size, w, col, alpha);
        p.pop();
      }
      cx += size * advance(ch) + p.random(-0.04, 0.09) * size;
    }
    return cx - x;
  }
`.trim();

/** Inlines the alphabet at the `// @font` marker inside a sketch source. */
export function withFont(code: string): string {
  return code.replace('  // @font', HAND_FONT);
}
