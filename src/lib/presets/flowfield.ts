export const FLOWFIELD = String.raw`
// "Slow Weather" — 2,600 particles advected through a layered Perlin field,
// painted with an inferno ramp. Animated: it settles after ~900 frames.
function sketch(p) {
  const S = 1000;
  const N = 2600;
  const FRAMES = 900;
  const STOPS = [
    [10, 7, 35], [74, 12, 107], [159, 42, 99],
    [221, 81, 58], [252, 165, 10], [252, 255, 164],
  ];
  let parts = [];

  p.setup = function () {
    p.createCanvas(S, S);
    p.pixelDensity(1);
    p.randomSeed(7);
    p.noiseSeed(7);
    p.noiseDetail(4, 0.55);
    p.background(9, 6, 16);
    p.blendMode(p.ADD);
    for (let i = 0; i < N; i++) parts.push(spawn());
  };

  p.draw = function () {
    for (const q of parts) {
      const a = field(q.x, q.y);
      q.px = q.x;
      q.py = q.y;
      q.x += p.cos(a) * q.speed;
      q.y += p.sin(a) * q.speed;
      q.age++;

      const c = ramp(p.constrain(q.tone + p.sin(q.age * 0.006) * 0.12, 0, 1));
      p.stroke(c[0], c[1], c[2], 16 + q.speed * 6);
      p.strokeWeight(q.weight);
      p.line(q.px, q.py, q.x, q.y);

      if (q.age > q.life || q.x < -20 || q.x > S + 20 || q.y < -20 || q.y > S + 20) {
        Object.assign(q, spawn());
      }
    }

    if (p.frameCount >= FRAMES) {
      p.blendMode(p.BLEND);
      finish();
      p.noLoop();
    }
  };

  function field(x, y) {
    // Two octaves at different scales give the field its braided structure.
    const n1 = p.noise(x * 0.0016, y * 0.0016, p.frameCount * 0.0011);
    const n2 = p.noise(x * 0.0068 + 40, y * 0.0068 + 40);
    return (n1 * 2.4 + n2 * 0.9) * p.TWO_PI;
  }

  function spawn() {
    // Seed along a soft diagonal band so the composition keeps a spine.
    const t = p.random();
    const jitter = p.randomGaussian(0, 190);
    return {
      x: p.constrain(t * S + jitter, 0, S),
      y: p.constrain(S - t * S + p.randomGaussian(0, 190), 0, S),
      px: 0,
      py: 0,
      speed: p.random(0.6, 2.6),
      weight: p.random() < 0.08 ? p.random(1.6, 3.2) : p.random(0.4, 1.2),
      tone: p.constrain(p.randomGaussian(0.55, 0.24), 0, 1),
      age: 0,
      life: p.random(160, 900),
    };
  }

  function ramp(t) {
    const f = p.constrain(t, 0, 0.9999) * (STOPS.length - 1);
    const i = p.floor(f);
    const k = f - i;
    const a = STOPS[i];
    const b = STOPS[i + 1];
    return [p.lerp(a[0], b[0], k), p.lerp(a[1], b[1], k), p.lerp(a[2], b[2], k)];
  }

  function finish() {
    // Vignette, then film grain, so the field reads as a print not a screen.
    p.noStroke();
    for (let r = 0; r < 220; r++) {
      p.fill(6, 4, 12, 2.2);
      p.rect(0, 0, S, r * 0.5);
      p.rect(0, S - r * 0.5, S, r * 0.5);
      p.rect(0, 0, r * 0.5, S);
      p.rect(S - r * 0.5, 0, r * 0.5, S);
    }
    for (let i = 0; i < 120000; i++) {
      p.fill(255, 250, 240, p.random(3, 12));
      p.rect(p.random(S), p.random(S), 1, 1);
    }
  }
}
`.trim();
