export const ATTRACTOR = String.raw`
// "De Jong, Counted Twice" — 12 million iterations of the De Jong map
// accumulated into a density buffer, then tone-mapped through a viridis ramp.
function sketch(p) {
  const S = 1000;
  const PER_FRAME = 400000;
  const PASSES = 30;
  const A = 1.641, B = 1.902, C = 0.316, D = 1.525;
  const STOPS = [
    [12, 8, 34], [38, 52, 116], [33, 106, 132],
    [46, 156, 108], [148, 195, 65], [248, 231, 68],
  ];
  let density;
  let x = 0.1;
  let y = 0.1;
  let peak = 1;

  p.setup = function () {
    p.createCanvas(S, S);
    p.pixelDensity(1);
    p.randomSeed(1525);
    density = new Float32Array(S * S);
    p.background(10, 8, 26);
  };

  p.draw = function () {
    for (let i = 0; i < PER_FRAME; i++) {
      const nx = p.sin(A * y) - p.cos(B * x);
      const ny = p.sin(C * x) - p.cos(D * y);
      x = nx;
      y = ny;
      // The attractor lives in about [-2, 2]; map it in with a margin.
      const px = ((x * 0.235 + 0.5) * S) | 0;
      const py = ((y * 0.235 + 0.5) * S) | 0;
      if (px < 0 || px >= S || py < 0 || py >= S) continue;
      const idx = py * S + px;
      density[idx] += 1;
      if (density[idx] > peak) peak = density[idx];
    }

    tonemap();
    if (p.frameCount >= PASSES) {
      grain();
      p.noLoop();
    }
  };

  function tonemap() {
    p.loadPixels();
    const px = p.pixels;
    const inv = 1 / p.log(1 + peak);
    for (let i = 0; i < S * S; i++) {
      const d = density[i];
      const o = i * 4;
      if (d === 0) {
        px[o] = 10; px[o + 1] = 8; px[o + 2] = 26; px[o + 3] = 255;
        continue;
      }
      const c = ramp(p.pow(p.log(1 + d) * inv, 0.62));
      px[o] = c[0];
      px[o + 1] = c[1];
      px[o + 2] = c[2];
      px[o + 3] = 255;
    }
    p.updatePixels();
  }

  function ramp(t) {
    const f = p.constrain(t, 0, 0.9999) * (STOPS.length - 1);
    const i = f | 0;
    const k = f - i;
    const a = STOPS[i];
    const b = STOPS[i + 1];
    return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
  }

  function grain() {
    p.noStroke();
    for (let i = 0; i < 90000; i++) {
      p.fill(255, 252, 245, p.random(2, 10));
      p.rect(p.random(S), p.random(S), 1, 1);
    }
  }
}
`.trim();
