export const VESSELS = String.raw`
// "Nine Vessels, Stippled" — silhouettes assembled from random easing curves,
// then rendered as solids of revolution: every horizontal slice is an ellipse
// of stroke dots, brighter on the lit side. Technique after newyellow's
// "Zen Pots" (openprocessing.org/sketch/2036000), rewritten from scratch.
function sketch(p) {
  const W = 1400;
  const H = 1000;
  const BASE = 790;
  const PAD = 110;
  const DOT = 0.85;      // dots per pixel of slice perimeter
  const SLICE = 0.8;     // slices per pixel of pot height
  const SQUASH = 0.24;   // how much the ellipse of revolution is foreshortened

  const SET = {
    bg: [34, 10, 96],
    haze: [28, 22, 74],
    shell: [222, 46, 34],
    inner: [16, 58, 88],
    rim: [206, 24, 74],
    shadow: [232, 20, 52],
  };

  let queue = [];
  let cursor = 0;

  p.setup = function () {
    p.createCanvas(W, H);
    p.pixelDensity(2);
    p.colorMode(p.HSB, 360, 100, 100, 1);
    p.randomSeed(2036);
    p.noiseSeed(1007);
    p.background(SET.bg[0], SET.bg[1], SET.bg[2]);
    p.noFill();

    ground();

    const count = p.floor(p.random(7, 12));
    const slot = (W - PAD * 2) / count;
    for (let i = 0; i < count; i++) {
      const cx = PAD + (i + 0.5) * slot;
      const rMax = slot * p.random(0.28, 0.46);
      const height = slot * p.random(0.55, 2.1);
      enqueue(cx, rMax, height);
    }
    // Draw back to front so the taller pots overlap cleanly.
    queue.sort((a, b) => a.y - b.y);
  };

  p.draw = function () {
    const budget = 14;
    for (let i = 0; i < budget && cursor < queue.length; i++, cursor++) {
      const s = queue[cursor];
      if (s.kind === 'body') bodySlice(s);
      else if (s.kind === 'rim') rimSlice(s);
      else shadowSlice(s);
    }
    if (cursor >= queue.length) {
      speckle();
      p.noLoop();
    }
  };

  // ---- silhouette ---------------------------------------------------------

  const EASES = [
    (t) => t,
    (t) => t * t,
    (t) => 1 - (1 - t) * (1 - t),
    (t) => t * t * (3 - 2 * t),
    (t) => 1 - p.cos((t * p.PI) / 2),
    (t) => p.sin((t * p.PI) / 2),
    (t) => (t < 0.5 ? 4 * t * t * t : 1 - p.pow(-2 * t + 2, 3) / 2),
  ];

  function profile(rMax) {
    const n = p.floor(p.random(3, 9));
    const ctrl = [];
    for (let i = 0; i < n; i++) ctrl.push(p.random(0.28, 1) * rMax);
    // A pot reads as a pot when the foot is narrower than the belly.
    ctrl[0] = rMax * p.random(0.3, 0.6);
    const eases = [];
    for (let i = 0; i < n - 1; i++) eases.push(EASES[p.floor(p.random(EASES.length))]);
    return function (t) {
      const f = p.constrain(t, 0, 0.9999) * (n - 1);
      const i = p.floor(f);
      return p.lerp(ctrl[i], ctrl[i + 1], eases[i](f - i));
    };
  }

  function enqueue(cx, rMax, height) {
    const r = profile(rMax);
    const slices = p.floor(height * SLICE);
    const hue = SET.shell[0] + p.random(-14, 14);
    for (let i = 0; i < slices; i++) {
      const t = i / (slices - 1);
      queue.push({ kind: 'body', x: cx, y: BASE - t * height, r: r(t), t: t, hue: hue });
    }
    queue.push({ kind: 'rim', x: cx, y: BASE - height, r: r(1), hue: hue });
    queue.push({ kind: 'shadow', x: cx, y: BASE + 4, r: rMax * p.random(1.1, 1.5) });
  }

  // ---- stipple primitives -------------------------------------------------

  function dotRing(cx, cy, rx, ry, col, weight, density, alpha) {
    const perim = p.TWO_PI * p.sqrt((rx * rx + ry * ry) / 2);
    const n = p.max(10, p.floor(perim * DOT * density));
    for (let i = 0; i < n; i++) {
      const a = (p.TWO_PI * i) / n + p.random(-0.02, 0.02);
      const lit = (1 - p.cos(a + 0.9)) / 2; // light falls from the upper left
      const x = cx + rx * p.sin(a) + p.random(-0.7, 0.7);
      const y = cy + ry * -p.cos(a) + p.random(-0.7, 0.7);
      p.stroke(
        col[0] + p.random(-6, 6),
        col[1] * p.random(0.85, 1.1),
        p.constrain(col[2] + lit * 16 - 8, 0, 100),
        alpha * p.random(0.45, 1),
      );
      p.strokeWeight(weight * p.abs(p.sin(a + p.random(-1, 1))) * p.random(0.6, 1.4));
      p.point(x, y);
    }
  }

  function bodySlice(s) {
    const ry = s.r * SQUASH;
    dotRing(s.x, s.y, s.r, ry, [s.hue, SET.shell[1], SET.shell[2]], 1.7, 1, 0.5);
    dotRing(s.x, s.y, s.r * 0.86, ry * 0.86, SET.inner, 0.9, 0.45, 0.28);
  }

  function rimSlice(s) {
    const ry = s.r * SQUASH;
    for (let k = 0; k < 3; k++) {
      dotRing(s.x, s.y - k * 0.8, s.r - k * 0.6, ry - k * 0.5, [s.hue, SET.rim[1], SET.rim[2]], 2.1, 1.3, 0.6);
    }
  }

  function shadowSlice(s) {
    p.push();
    for (let i = 0; i < 260; i++) {
      const a = p.random(p.TWO_PI);
      const d = p.pow(p.random(), 0.6);
      p.stroke(SET.shadow[0], SET.shadow[1], SET.shadow[2], p.random(0.05, 0.3) * (1 - d));
      p.strokeWeight(p.random(0.6, 2));
      p.point(s.x + p.cos(a) * s.r * d, s.y + p.sin(a) * s.r * SQUASH * d * 0.9);
    }
    p.pop();
  }

  // ---- ground and finish --------------------------------------------------

  function ground() {
    // A haze of dots settling toward the shelf line, drawn once.
    for (let i = 0; i < 42000; i++) {
      const x = p.random(W);
      const spread = 150;
      const y = BASE - p.abs(p.randomGaussian(0, spread)) * p.random(0.2, 1.6);
      const fade = 1 - p.constrain(p.abs(BASE - y) / (spread * 2), 0, 1);
      p.stroke(SET.haze[0], SET.haze[1], SET.haze[2], 0.06 + fade * 0.16);
      p.strokeWeight(p.random(0.5, 1.9));
      p.point(x, y);
    }
    p.stroke(SET.haze[0], SET.haze[1], 60, 0.25);
    p.strokeWeight(1);
    for (let x = 0; x < W; x += p.random(2, 9)) p.point(x, BASE + p.random(-1, 1));
  }

  function speckle() {
    for (let i = 0; i < 9000; i++) {
      p.stroke(SET.haze[0], p.random(10, 40), p.random(20, 90), p.random(0.03, 0.12));
      p.strokeWeight(p.random(0.5, 1.6));
      p.point(p.random(W), p.random(H));
    }
  }
}
`.trim();
