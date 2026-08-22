export const PATCHES = String.raw`
// "Fifteen Patches" — fifteen bands of long wandering strokes logged left to
// right across five columns. Open bands keep their passes separate; slabs were
// gone over until they closed; one is fringed with slate hair. The hand moved
// horizontally all day and never lifted for long.
function sketch(p) {
  const W = 1000;
  const H = 1400;
  const LEFT = 100;
  const RIGHT = 958;
  const TOP = 236;

  const PAL = {
    coral: [218, 134, 112],
    blush: [232, 166, 148],
    rust: [206, 122, 74],
    olive: [160, 170, 102],
    ink: [30, 30, 34],
    slate: [98, 114, 140],
    red: [208, 68, 48],
  };

  // The fifteen patches, top to bottom. h is the band height, rows the number
  // of passes stacked in it, run how far right that patch was carried before
  // the hand stopped, and inks the pigments it was worked in.
  const BANDS = [
    { h: 64, rows: 6, kind: 'open', run: 0.84, inks: ['coral', 'ink', 'coral', 'olive', 'blush', 'ink'] },
    { h: 58, rows: 5, kind: 'open', run: 0.95, inks: ['ink', 'coral', 'coral', 'olive', 'ink', 'blush'] },
    { h: 46, rows: 9, kind: 'slab', run: 0.9, inks: ['rust', 'coral', 'ink', 'coral', 'olive'] },
    { h: 66, rows: 6, kind: 'open', run: 0.8, inks: ['coral', 'blush', 'olive', 'coral', 'ink'] },
    { h: 60, rows: 5, kind: 'open', run: 0.92, inks: ['coral', 'ink', 'coral', 'slate', 'coral'] },
    { h: 48, rows: 9, kind: 'slab', run: 0.96, inks: ['coral', 'ink', 'rust', 'coral', 'olive'] },
    { h: 52, rows: 9, kind: 'slab', run: 0.88, inks: ['coral', 'coral', 'ink', 'blush', 'olive'] },
    { h: 70, rows: 5, kind: 'fringe', run: 0.93, inks: ['slate', 'ink', 'slate', 'olive', 'coral'] },
    { h: 62, rows: 6, kind: 'open', run: 0.97, inks: ['coral', 'olive', 'coral', 'ink', 'blush'] },
    { h: 60, rows: 5, kind: 'open', run: 0.9, inks: ['coral', 'slate', 'coral', 'olive', 'ink'] },
    { h: 48, rows: 8, kind: 'slab', run: 0.78, inks: ['red', 'coral', 'ink', 'rust', 'olive'] },
    { h: 64, rows: 6, kind: 'open', run: 0.86, inks: ['coral', 'slate', 'olive', 'coral', 'ink'] },
    { h: 60, rows: 5, kind: 'open', run: 0.82, inks: ['slate', 'coral', 'olive', 'coral', 'ink'] },
    { h: 46, rows: 8, kind: 'slab', run: 0.8, inks: ['red', 'coral', 'ink', 'olive', 'coral'] },
    { h: 44, rows: 5, kind: 'open', run: 0.76, inks: ['ink', 'red', 'coral', 'olive', 'coral'] },
  ];
  const GAPS = [24, 20, 18, 22, 20, 16, 20, 22, 20, 22, 24, 20, 22, 18, 0];

  p.setup = function () {
    p.createCanvas(W, H);
    p.pixelDensity(2);
    p.randomSeed(116);
    p.noiseSeed(140);
    p.noLoop();
  };

  p.draw = function () {
    paper();
    ruling();
    header();
    columnNumbers();

    // Every pass is overprinted, so the crossings darken instead of covering.
    p.blendMode(p.MULTIPLY);
    let y = TOP;
    for (let i = 0; i < BANDS.length; i++) {
      band(BANDS[i], y, i);
      y += BANDS[i].h + GAPS[i];
    }
    p.blendMode(p.BLEND);

    marginType();
    blot(922, 300);
    specks();
  };

  // ---- ground -------------------------------------------------------------

  function paper() {
    p.background(236, 231, 214);
    p.noStroke();
    for (let i = 0; i < 46000; i++) {
      const x = p.random(W);
      const y = p.random(H);
      const v = p.noise(x * 0.008, y * 0.008);
      if (v > 0.54) p.fill(158, 146, 120, p.random(5, 24));
      else p.fill(255, 252, 243, p.random(6, 30));
      p.rect(x, y, 1, 1);
    }
    // The sheet darkens where it was held.
    for (let i = 0; i < 9000; i++) {
      const x = p.random(W);
      const y = p.random(H);
      const edge = Math.min(x, W - x, y, H - y);
      if (edge < 90) p.fill(150, 138, 112, p.map(edge, 0, 90, 22, 0));
      p.rect(x, y, 1, 1);
    }
  }

  function ruling() {
    p.stroke(150, 158, 168, 46);
    p.strokeWeight(1);
    for (const y of [284, 402, 690, 980, 1268]) dashed(46, y, W - 40, y, 7, 6);
    for (const x of [300, 520, 740, 902]) dashed(x, 120, x, H - 90, 5, 9);
    p.noStroke();
    for (let i = 0; i < 900; i++) {
      p.fill(146, 154, 166, p.random(10, 34));
      p.rect(60 + p.floor(p.random(46)) * 20, 150 + p.floor(p.random(60)) * 20, 1, 1);
    }
  }

  // ---- the patches --------------------------------------------------------

  function band(b, y, index) {
    const x2 = LEFT + (RIGHT - LEFT) * b.run;
    const rowGap = b.h / (b.rows + 1);

    // A slab starts from a broad chalky bed that the passes then close over.
    if (b.kind === 'slab') {
      crayon(LEFT - 8, x2 + p.random(-10, 26), y + b.h * 0.5, tint(b, 0), 5, b.h * 0.3, 7, 20, 4);
    }

    for (let r = 0; r < b.rows; r++) {
      const key = b.inks[(r + index) % b.inks.length];
      const col = tint(b, r + index);
      // The pen runs get leant on; the crayon rows do not.
      const heavy = key === 'ink' || key === 'red';
      const ry = y + rowGap * (r + 1) + p.random(-2.5, 2.5);
      let x1 = LEFT + (r % 3 === 0 ? p.random(0, 96) : p.random(0, 26));
      let xe = x2 - (r % 2 === 0 ? p.random(0, 130) : p.random(0, 40));
      if (xe - x1 < 140) xe = x1 + 140;

      const amp = rowGap * (b.kind === 'slab' ? 0.5 : 0.3);
      if (b.kind === 'slab') crayon(x1, xe, ry, col, 2, rowGap * 0.28, 3.5, 92, amp);
      else if (heavy) crayon(x1, xe, ry, col, 2, rowGap * 0.12, 4, 185, amp * 0.7);
      else crayon(x1, xe, ry, col, 2, rowGap * 0.18, 2.7, 105, amp);

      if (p.random() < 0.34) hook(x1 + p.random(-4, 30), ry, 1, col);
      if (p.random() < 0.22) hook(xe + p.random(-30, 4), ry, -1, col);
      if (p.random() < 0.55) ticks(x1, xe, ry, p.floor(p.random(6, 26)), PAL.ink);
    }

    if (b.kind === 'fringe') fringeHair(LEFT, x2, y, b.h, PAL.slate, b.rows);
  }

  /** One long pass, worked over several times the way a crayon is. */
  function crayon(x1, x2, y, col, passes, spread, weight, alpha, amp) {
    for (let i = 0; i < passes; i++) {
      const off = p.random(-spread, spread);
      pass(
        x1 + p.random(-6, 10),
        x2 + p.random(-10, 6),
        y + off,
        col,
        weight * p.random(0.7, 1.2),
        alpha * p.random(0.7, 1.05),
        amp,
      );
    }
  }

  /**
   * A single stroke: the height wanders on low-frequency noise, the pressure
   * enters light, thickens through the middle and lifts at the end, and the
   * dry sheet drops the odd segment.
   */
  function pass(x1, x2, y, col, weight, alpha, ampMax) {
    const span = Math.max(1, x2 - x1);
    const seed = p.random(900);
    const amp = p.random(0.35, 1) * ampMax;
    p.noFill();
    let px = x1;
    let py = y + wander(x1, seed, amp);
    for (let x = x1 + 6; x <= x2; x += 6) {
      const ny = y + wander(x, seed, amp);
      const t = (x - x1) / span;
      const press = 0.34 + 0.66 * Math.sin(Math.PI * Math.pow(t, 0.72));
      if (p.random() > 0.035) {
        p.stroke(
          col[0] + p.random(-9, 9),
          col[1] + p.random(-9, 9),
          col[2] + p.random(-9, 9),
          p.constrain(alpha * press, 8, 255),
        );
        p.strokeWeight(Math.max(0.45, weight * press + p.random(-0.3, 0.3)));
        p.line(px, py, x, ny);
      }
      px = x;
      py = ny;
    }
  }

  function wander(x, seed, amp) {
    return (p.noise(x * 0.0022, seed) - 0.5) * amp * 2 + (p.noise(x * 0.028, seed + 40) - 0.5) * 2.2;
  }

  /** The small bracket the hand makes where a pass turned back on itself. */
  function hook(x, y, dir, col) {
    const up = p.random(6, 14);
    const len = p.random(11, 30) * dir;
    p.noFill();
    p.stroke(col[0], col[1], col[2], p.random(170, 225));
    p.strokeWeight(p.random(1.1, 2.1));
    p.beginShape();
    p.vertex(x, y + p.random(-1, 1));
    p.vertex(x + p.random(-1.5, 1.5), y - up);
    p.vertex(x + len, y - up + p.random(-2, 2));
    p.vertex(x + len + p.random(-1.5, 1.5), y + p.random(-1, 2.5));
    p.endShape();
  }

  /** Counting marks dropped along a pass: squares, uprights, short bars. */
  function ticks(x1, x2, y, n, col) {
    p.noStroke();
    for (let i = 0; i < n; i++) {
      const x = p.random(x1, x2);
      const r = p.random();
      p.fill(col[0], col[1], col[2], p.random(160, 235));
      if (r < 0.45) p.rect(x, y - p.random(1, 4), p.random(1.5, 4), p.random(1.5, 4));
      else if (r < 0.8) p.rect(x, y - p.random(3, 9), 1.2, p.random(3, 9));
      else p.rect(x, y - 1, p.random(5, 15), 1.4);
    }
  }

  function fringeHair(x1, x2, y, h, col, rows) {
    p.noFill();
    const rowGap = h / (rows + 1);
    for (let r = 0; r < rows; r++) {
      const ry = y + rowGap * (r + 1);
      for (let x = x1 + p.random(0, 14); x < x2; x += p.random(3, 9)) {
        const len = p.random(7, 15);
        p.stroke(col[0], col[1], col[2], p.random(70, 165));
        p.strokeWeight(p.random(0.6, 1.5));
        p.line(x, ry + p.random(-1.5, 1.5), x + p.random(-2, 2), ry + len);
      }
    }
  }

  function tint(b, i) {
    const key = b.inks[i % b.inks.length];
    const col = PAL[key] || PAL.ink;
    return [col[0], col[1], col[2]];
  }

  // ---- lettering and furniture -------------------------------------------

  function header() {
    letter(150, 168, 'FIFTEEN PATCHES', 27, [78, 78, 88], 235);
    p.stroke(86, 86, 96, 180);
    p.strokeWeight(1.6);
    p.noFill();
    p.beginShape();
    for (let x = 146; x < 468; x += 12) p.vertex(x, 180 + p.random(-1.2, 1.2));
    p.endShape();
    letter(158, 202, 'JAN 16', 19, [78, 78, 88], 225);
  }

  function columnNumbers() {
    const xs = [112, 246, 372, 486, 604];
    for (let i = 0; i < xs.length; i++) letter(xs[i], 224, String(i + 1), 14, [70, 70, 80], 190);
  }

  function marginType() {
    p.noStroke();
    p.fill(80, 80, 90, 165);
    p.textFont('monospace');
    p.textSize(9);
    p.text('1 OF 8', 16, 26);
    letter(78, 96, '140', 13, [86, 86, 96], 190);
    letter(38, 1058, '115', 15, [70, 70, 80], 200);

    // Read from the right edge, turned with the page.
    p.push();
    p.translate(926, 928);
    p.rotate(-p.HALF_PI);
    p.noStroke();
    p.fill(198, 78, 60, 215);
    p.textFont('monospace');
    p.textSize(11);
    p.text('IT WAS OVER BEFORE I LOOKED UP', 0, 0);
    p.pop();
  }

  function blot(x, y) {
    p.noStroke();
    for (let i = 0; i < 260; i++) {
      const a = p.random(p.TWO_PI);
      const r = p.random(p.random(9));
      p.fill(20, 20, 24, p.random(120, 230));
      p.ellipse(x + Math.cos(a) * r, y + Math.sin(a) * r * 0.8, p.random(1, 3.4), p.random(1, 3));
    }
    for (let i = 0; i < 16; i++) {
      p.fill(20, 20, 24, p.random(90, 190));
      p.ellipse(x + p.random(-20, 20), y + p.random(-16, 16), p.random(0.8, 2), p.random(0.8, 2));
    }
  }

  function specks() {
    p.noStroke();
    for (let i = 0; i < 620; i++) {
      p.fill(28, 28, 32, p.random(40, 170));
      p.rect(p.random(W), p.random(H), p.random(0.8, 1.8), p.random(0.8, 1.8));
    }
    for (const s of [[556, 132], [900, 350], [618, 128]]) {
      for (let i = 0; i < 40; i++) {
        p.fill(212, 190, 92, p.random(50, 150));
        p.rect(s[0] + p.random(-7, 7), s[1] + p.random(-7, 7), p.random(1, 2.4), p.random(1, 2.4));
      }
    }
  }

  function letter(x, y, str, size, col, alpha) {
    p.push();
    p.noStroke();
    p.textFont('monospace');
    p.textSize(size);
    let cx = x;
    for (const ch of str) {
      p.push();
      p.translate(cx, y + p.random(-1.1, 1.1));
      p.rotate(p.random(-0.022, 0.022));
      p.fill(col[0], col[1], col[2], alpha - p.random(0, 35));
      p.text(ch, 0, 0);
      p.pop();
      cx += size * 0.64 + p.random(-1, 1.6);
    }
    p.pop();
  }

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
`.trim();
