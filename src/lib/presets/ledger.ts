import { withFont } from './handfont';

export const LEDGER = withFont(String.raw`
// "The Wall, Done" — a hand-kept ledger on graph paper: hatched blocks,
// stippled patches and ink bars laid out against a ruled time column.
function sketch(p) {
  const W = 1000;
  const H = 1400;
  const INK = [24, 24, 28];
  const COLS = [
    { x: 235, w: 130 },
    { x: 380, w: 120 },
    { x: 515, w: 135 },
    { x: 665, w: 125 },
  ];
  const TIMES = ['0200', '0230', '0300', '0330', '0400', '0430', '0500', '0530'];
  const NOTES = [
    'BY TIME',
    'BLATTER, 7 ONLY',
    'BUILD, LIKE BLATTER',
    'SHARP, 7 ONLY',
    'BLATTER, LIKE CREPUSCULAR',
    'SHARP ONE, LIKE CREPUSCULAR',
  ];

  p.setup = function () {
    p.createCanvas(W, H);
    p.pixelDensity(2);
    p.randomSeed(11);
    p.noiseSeed(11);
    p.noLoop();
  };

  p.draw = function () {
    paper();
    graphGrid();
    marginRules();

    label(160, 210, 'THE WALL, DONE   11.05.25', 21, 1);

    for (let i = 0; i < TIMES.length; i++) label(158, 280 + i * 100, TIMES[i], 17, 0.95);

    for (let c = 0; c < COLS.length; c++) {
      column(COLS[c].x, COLS[c].w, 250, 1000, c);
      label(COLS[c].x + COLS[c].w / 2 - 4, 1042, String(c + 1), 14, 0.55);
    }

    label(176, 1096, 'PATC', 13, 0.55);
    for (let i = 0; i < NOTES.length; i++) {
      const y = 1122 + i * 27;
      label(150, y, '>', 13, 0.75);
      label(170, y, NOTES[i], 14, 0.92);
    }

    // Recap panel, bottom right: same day, counted a second time.
    stipple(648, 1118, 148, 138, 0.66);
    inkBar(648, 1266, 88, 12);
    for (let i = 0; i < TIMES.length; i++) {
      label(572, 1128 + i * 22, TIMES[i], 11, 0.55);
      label(846, 1128 + i * 22, TIMES[i], 11, 0.55);
    }
    p.noStroke();
    p.fill(20, 20, 26, 220);
    p.rect(622, 1305, 3, 3);
    p.rect(826, 1305, 3, 3);

    label(222, 1356, 'COUNT IT AGAIN', 13, 0.7);
    handText('MISMARKED THE FIRST PATCH', 414, 1364, 13, [126, 104, 62], 215);
  };

  // ---- surfaces -----------------------------------------------------------

  function paper() {
    p.background(238, 233, 220);
    p.noStroke();
    for (let i = 0; i < 46000; i++) {
      const x = p.random(W);
      const y = p.random(H);
      const v = p.noise(x * 0.01, y * 0.01);
      if (v > 0.52) p.fill(150, 140, 118, p.random(6, 26));
      else p.fill(255, 252, 244, p.random(8, 34));
      p.rect(x, y, 1, 1);
    }
  }

  function graphGrid() {
    p.strokeWeight(1);
    for (let x = 40; x < W; x += 12) {
      p.stroke(96, 152, 176, x % 60 === 40 ? 80 : 40);
      p.line(x, 0, x, H);
    }
    for (let y = 20; y < H; y += 12) {
      p.stroke(96, 152, 176, y % 60 === 20 ? 80 : 40);
      p.line(0, y, W, y);
    }
  }

  function marginRules() {
    p.stroke(186, 96, 88, 150);
    p.strokeWeight(1.2);
    p.line(52, 0, 52, H);

    p.stroke(70, 82, 110, 95);
    p.strokeWeight(1);
    for (const y of [190, 350, 610, 830, 1010, 1082]) dashed(24, y, W - 24, y, 7, 6);
    for (const x of [235, 380, 515, 665, 795]) dashed(x, 176, x, 1042, 6, 7);

    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    for (let i = 0; i < days.length; i++) label(14, 115 + i * 190, days[i], 22, 0.72);

    // A stub of tape or a pencil stub left on the page.
    p.push();
    p.noStroke();
    p.fill(178, 156, 104, 190);
    p.rect(118, 890, 8, 84);
    p.fill(60, 54, 44, 210);
    p.triangle(118, 974, 126, 974, 122, 986);
    p.pop();
  }

  // ---- marks --------------------------------------------------------------

  function column(x, w, top, bottom, seedShift) {
    let y = top + p.random(-6, 50) + seedShift * 11;
    while (y < bottom - 40) {
      const h = p.random([38, 52, 66, 84, 108]);
      const roll = p.random();
      if (roll < 0.14) {
        inkBar(x, y + h * 0.4, w * p.random(0.6, 1), p.random(8, 12));
        y += h * 0.75;
      } else if (roll < 0.36) {
        const box = p.min(h * 1.5, 130);
        stipple(x, y, w, box, p.random(0.4, 0.8));
        y += box + p.random(8, 30);
      } else {
        hatch(x, y, w, h);
        y += h + p.random(10, 38);
      }
    }
  }

  function hatch(x, y, w, h) {
    p.strokeCap(p.SQUARE);
    for (let yy = y; yy < y + h; yy += 1.6) {
      const jitterL = p.random(-2, 5);
      const jitterR = p.random(-16, 3);
      const short = p.random() < 0.16 ? p.random(0.35, 0.8) : 1;
      p.stroke(INK[0], INK[1], INK[2], p.random(200, 252));
      p.strokeWeight(p.random(1.5, 2.7));
      p.line(x + jitterL, yy, x + (w + jitterR) * short, yy + p.random(-0.4, 0.4));
    }
  }

  function stipple(x, y, w, h, bias) {
    p.push();
    p.stroke(INK[0], INK[1], INK[2], 190);
    p.strokeWeight(1.4);
    p.noFill();
    p.rect(x, y, w, h);
    p.noStroke();
    const cx = x + w * bias;
    const cy = y + h * p.random(0.35, 0.65);
    const n = p.floor(w * h * 0.85);
    for (let i = 0; i < n; i++) {
      const gx = p.constrain(p.randomGaussian(cx, w * 0.22), x + 1, x + w - 1);
      const gy = p.constrain(p.randomGaussian(cy, h * 0.22), y + 1, y + h - 1);
      p.fill(INK[0], INK[1], INK[2], p.random(90, 240));
      p.rect(gx, gy, p.random() < 0.25 ? 1.6 : 1, 1);
    }
    p.pop();
  }

  function inkBar(x, y, w, h) {
    p.push();
    p.noStroke();
    p.fill(12, 12, 16, 245);
    p.rect(x, y, w, h);
    for (let i = 0; i < 44; i++) {
      p.fill(12, 12, 16, p.random(90, 220));
      p.rect(x + p.random(-4, w + 4), y + p.random(-2, h + 2), p.random(2, 7), p.random(1, 3));
    }
    p.pop();
  }

  // ---- lettering ----------------------------------------------------------

  function label(x, y, str, size, alpha) {
    handText(str, x, y, size, [38, 40, 52], 255 * alpha);
  }

  // @font

  function dashed(x1, y1, x2, y2, on, off) {
    const d = p.dist(x1, y1, x2, y2);
    const steps = p.floor(d / (on + off));
    for (let i = 0; i < steps; i++) {
      const a = (i * (on + off)) / d;
      const b = (i * (on + off) + on) / d;
      p.line(p.lerp(x1, x2, a), p.lerp(y1, y2, a), p.lerp(x1, x2, b), p.lerp(y1, y2, b));
    }
  }
}
`.trim());
