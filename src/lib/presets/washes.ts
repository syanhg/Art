import { withFont } from './handfont';

export const WASHES = withFont(String.raw`
// "Washes Against the Wall" — gouache squares registered to a printed
// engineering grid: a checkerboard field, stripe columns and long bars,
// every cell mottled and overprinted in MULTIPLY.
function sketch(p) {
  const W = 1000;
  const H = 1400;
  const CELL = 26;
  const INKS = [
    [111, 122, 74],  // olive
    [216, 169, 63],  // mustard
    [200, 72, 60],   // vermilion
    [124, 74, 82],   // plum
    [176, 50, 37],   // deep red
  ];

  p.setup = function () {
    p.createCanvas(W, H);
    p.pixelDensity(2);
    p.randomSeed(48);
    p.noiseSeed(5105);
    p.noLoop();
  };

  p.draw = function () {
    paper();
    printedGrid();

    p.blendMode(p.MULTIPLY);
    olivePatch();
    yellowBlotch();
    checkerField();
    longBars();
    stripeColumns();
    hook();
    bottomBars();
    p.blendMode(p.BLEND);

    title();
    marginType();
    punchHoles();
    grain();
  };

  // ---- ground -------------------------------------------------------------

  function paper() {
    p.background(240, 232, 220);
    p.noStroke();
    for (let i = 0; i < 20000; i++) {
      const x = p.random(W);
      const y = p.random(H);
      p.fill(214, 196, 172, p.random(4, 22));
      p.rect(x, y, p.random(1, 3), 1);
    }
  }

  function printedGrid() {
    p.strokeWeight(1);
    for (let x = 40; x < W - 20; x += 10) {
      p.stroke(198, 104, 74, x % 50 === 40 ? 105 : 48);
      p.line(x, 60, x, H - 40);
    }
    for (let y = 60; y < H - 40; y += 10) {
      p.stroke(198, 104, 74, y % 50 === 60 ? 105 : 48);
      p.line(40, y, W - 20, y);
    }
    p.stroke(176, 72, 48, 190);
    p.strokeWeight(1.6);
    p.rect(40, 60, W - 60, H - 100);
    p.stroke(70, 86, 128, 90);
    p.strokeWeight(1);
    for (const y of [232, 388, 700, 780, 1132]) dashed(40, y, W - 20, y, 8, 7);
  }

  // ---- wash primitives ----------------------------------------------------

  function wash(x, y, w, h, ink, alpha) {
    p.noStroke();
    p.fill(ink[0], ink[1], ink[2], alpha);
    p.quad(
      x + p.random(-1.4, 1.4), y + p.random(-1.4, 1.4),
      x + w + p.random(-1.4, 1.4), y + p.random(-1.4, 1.4),
      x + w + p.random(-1.4, 1.4), y + h + p.random(-1.4, 1.4),
      x + p.random(-1.4, 1.4), y + h + p.random(-1.4, 1.4),
    );
    // Pigment settling: a few darker pools and one bleached corner.
    for (let i = 0; i < 5; i++) {
      p.fill(ink[0], ink[1], ink[2], alpha * p.random(0.15, 0.45));
      p.rect(x + p.random(w * 0.6), y + p.random(h * 0.6), p.random(w * 0.2, w * 0.5), p.random(h * 0.2, h * 0.5));
    }
    p.fill(255, 252, 244, p.random(20, 70));
    p.rect(x + p.random(w * 0.5), y + p.random(h * 0.5), p.random(3, w * 0.35), p.random(3, h * 0.35));
  }

  function cell(cx, cy, ink, alpha) {
    wash(40 + cx * CELL, 60 + cy * CELL, CELL - p.random(0, 3), CELL - p.random(0, 3), ink, alpha);
  }

  // ---- composition --------------------------------------------------------

  function olivePatch() {
    for (let i = 0; i < 9; i++) cell(6 + i, 3 + (i === 3 ? 1 : 0), INKS[0], p.random(90, 170));
    cell(8, 4, INKS[0], 200);
    cell(8, 5, INKS[0], 160);
  }

  function yellowBlotch() {
    for (let i = 0; i < 26; i++) {
      const cx = 4 + p.floor(p.random(9));
      const cy = 8 + p.floor(p.random(3));
      cell(cx, cy, INKS[1], p.random(60, 150));
    }
    for (let i = 0; i < 6; i++) {
      cell(24 + p.floor(p.random(6)), 8 + p.floor(p.random(3)), p.random() < 0.5 ? INKS[1] : INKS[0], p.random(80, 160));
    }
  }

  function checkerField() {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 34; col++) {
        if ((row + col) % 2 === 1) continue;
        if (p.random() < 0.22) continue;
        const ink = INKS[p.floor(p.random(INKS.length))];
        cell(2 + col, 13 + row, ink, p.random(85, 185));
      }
    }
  }

  function longBars() {
    wash(46, 748, 480, 34, INKS[4], 205);
    wash(556, 745, 400, 36, INKS[4], 195);
  }

  function stripeColumns() {
    for (let c = 0; c < 21; c++) {
      const x = 3 + c * 1.6;
      const top = 24 + p.floor(p.random(2));
      const len = 12 + p.floor(p.random(8));
      for (let r = 0; r < len; r++) {
        if (p.random() < 0.12) continue;
        const ink = INKS[p.floor(p.random(INKS.length))];
        cell(p.floor(x), top + r, ink, p.random(90, 190));
      }
    }
  }

  function hook() {
    for (let r = 0; r < 6; r++) cell(11, 36 + r, INKS[2], p.random(120, 200));
    for (let c = 0; c < 3; c++) cell(11 + c, 41, INKS[4], p.random(120, 190));
  }

  function bottomBars() {
    const y = 1330;
    wash(46, y, 120, 40, INKS[4], 200);
    wash(166, y, 90, 40, INKS[1], 190);
    wash(256, y, 150, 40, INKS[2], 195);
    wash(560, y, 130, 40, INKS[3], 185);
    wash(690, y, 120, 40, INKS[1], 175);
    wash(810, y, 150, 40, INKS[0], 195);
  }

  // ---- print marks --------------------------------------------------------

  function title() {
    letter(120, 108, 'WASHES AGAINST THE WALL   25 AUG', 27, [62, 70, 96]);
    p.stroke(62, 70, 96, 170);
    p.strokeWeight(2);
    p.line(118, 122, 830, 122);
  }

  function marginType() {
    p.push();
    p.translate(26, 700);
    p.rotate(-p.HALF_PI);
    handText('2 CYCLES X 70 DIVISIONS   HALE & SON   MADE IN U.S.A.', -250, 0, 13, [176, 60, 44], 220);
    handText('48 5105', 220, 0, 20, [176, 60, 44], 230);
    p.pop();

    p.push();
    p.translate(972, 520);
    p.rotate(-p.HALF_PI);
    handText('TIE PAGE RAN OUT', 0, 0, 11, [70, 78, 104], 190);
    p.pop();

    handText('6 OF 11', 898, 34, 12, [70, 78, 104], 180);
    handText('123', 926, 1382, 12, [70, 78, 104], 180);
    for (let i = 0; i < 9; i++) {
      handText(String(i + 1), 22, 96 + i * 150, 13, [176, 60, 44], 200);
    }
  }

  function punchHoles() {
    p.noStroke();
    for (const h of [[566, 158], [908, 686], [1046, 682], [104, 1284], [906, 1178]]) {
      p.fill(248, 246, 240, 235);
      p.ellipse(h[0] % W, h[1], 13, 13);
      p.fill(198, 186, 168, 110);
      p.arc(h[0] % W, h[1], 13, 13, p.PI * 0.15, p.PI * 0.95);
    }
  }

  function grain() {
    p.noStroke();
    for (let i = 0; i < 26000; i++) {
      p.fill(255, 253, 246, p.random(6, 30));
      p.rect(p.random(W), p.random(H), 1, 1);
    }
  }

  function letter(x, y, str, size, col) {
    handText(str, x, y, size, col, 225);
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
