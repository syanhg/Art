export const MECHANISM = String.raw`
// "Skips by the Radiator Pipe" — an exploded gear train drawn in aniline
// purple, with blurred graphite smudges, leader lines and a tally of counts.
function sketch(p) {
  const W = 1000;
  const H = 1400;
  const INK = [66, 30, 66];
  const HI = [150, 42, 140];

  const TRAIN = [
    { x: 790, y: 190, r: 52, teeth: 14, squash: 0.42 },
    { x: 790, y: 300, r: 40, teeth: 12, squash: 0.30, ghost: true },
    { x: 800, y: 390, r: 95, teeth: 26, squash: 0.40 },
    { x: 780, y: 500, r: 108, teeth: 30, squash: 0.46 },
    { x: 745, y: 720, r: 88, teeth: 22, squash: 0.92 },
    { x: 640, y: 830, r: 82, teeth: 20, squash: 0.94 },
    { x: 500, y: 1000, r: 40, teeth: 10, squash: 0.90 },
  ];

  const LEFT_NOTES = [
    ['14', 'BACK, AS SOUND AS PLAY'],
    ['33', 'SNUG, AS SOUND AS BACK'],
    ['7', 'MAYBE SNUG'],
    ['34', 'CLICK, AS BAD AS SNUG'],
    ['35', 'AND CLICK'],
    ['10', 'BASEMENT, LIKE CLICK'],
    ['10', 'CLICK?'],
    ['22', 'BOUNCED ONE'],
  ];
  const RIGHT_NOTES = [
    ['1', 'CHURN, NOT ALLOWED'],
    ['40', 'NO, 34'],
    ['41', 'CHURN, LIKE'],
    ['', '    BATTERY FADE E5'],
    ['15', 'CHURN, STILL UNLABELLED'],
    ['28', 'CHURN'],
  ];

  p.setup = function () {
    p.createCanvas(W, H);
    p.pixelDensity(2);
    p.randomSeed(92);
    p.noiseSeed(18);
    p.noLoop();
  };

  p.draw = function () {
    paper();
    sectionLines();

    smudge(240, 350, 470, 120);
    smudge(230, 640, 300, 74);
    smudge(180, 1250, 300, 66);

    letter(210, 155, 'SKIPS BY THE RADIATOR PIPE', 27, INK, 0.95);
    letter(210, 196, '18.05.25', 22, INK, 0.9);

    leaders();
    for (const g of TRAIN) gear(g.x, g.y, g.r, g.teeth, g.squash, g.ghost);

    // A second, smaller pass of the same train, lower left.
    p.push();
    p.translate(360, 1160);
    p.scale(0.42);
    for (const g of TRAIN) gear(g.x - 640, g.y - 500, g.r, g.teeth, g.squash, g.ghost);
    p.pop();

    tally(345, 890, 8);
    notes();
    marginType();
    specks();
  };

  // ---- ground -------------------------------------------------------------

  function paper() {
    p.background(240, 236, 226);
    p.noStroke();
    for (let i = 0; i < 30000; i++) {
      const x = p.random(W);
      const y = p.random(H);
      p.fill(202, 194, 178, p.random(4, 20));
      p.rect(x, y, p.random(1, 2), 1);
    }
  }

  function sectionLines() {
    p.stroke(70, 78, 110, 105);
    p.strokeWeight(1.1);
    for (const y of [250, 480, 740, 1010]) dashed(30, y, W - 30, y, 16, 12);
    for (const x of [250, 460, 700]) dashed(x, 60, x, 1340, 16, 12);

    p.noStroke();
    const rows = [250, 480, 740, 1010];
    for (let i = 0; i < rows.length; i++) {
      p.fill(70, 78, 110, 190);
      p.textFont('monospace');
      p.textSize(18);
      p.text(String(i + 1), 218, rows[i] + 6);
      p.text(String(i + 1), 950, rows[i] + 6);
    }
  }

  function smudge(x, y, w, h) {
    p.push();
    p.drawingContext.filter = 'blur(16px)';
    p.noStroke();
    for (let i = 0; i < 26; i++) {
      const t = i / 26;
      p.fill(124, 110, 126, p.random(18, 46));
      p.ellipse(x + t * w + p.random(-14, 14), y + p.random(-h * 0.3, h * 0.3), p.random(w * 0.12, w * 0.3), p.random(h * 0.5, h));
    }
    for (let i = 0; i < 8; i++) {
      p.fill(150, 96, 140, p.random(10, 26));
      p.ellipse(x + p.random(w), y + p.random(-h * 0.2, h * 0.2), p.random(40, 120), p.random(20, h * 0.7));
    }
    p.drawingContext.filter = 'none';
    p.pop();
  }

  // ---- mechanism ----------------------------------------------------------

  function gear(x, y, r, teeth, squash, ghost) {
    p.push();
    p.translate(x, y);
    p.scale(1, squash);
    p.noFill();
    const alpha = ghost ? 80 : 252;
    p.stroke(INK[0], INK[1], INK[2], alpha);
    p.strokeWeight(ghost ? 1.3 : 2.3);
    wobble(r);
    if (!ghost) {
      p.strokeWeight(1.7);
      wobble(r * 0.8);
      wobble(r * 0.26);
      p.stroke(HI[0], HI[1], HI[2], 120);
      wobble(r * 0.52);
      p.stroke(INK[0], INK[1], INK[2], 250);
      p.strokeWeight(2.1);
      const tw = (p.TWO_PI / teeth) * 0.42;
      for (let i = 0; i < teeth; i++) {
        const a = (p.TWO_PI * i) / teeth;
        p.beginShape();
        p.vertex(p.cos(a - tw) * r, p.sin(a - tw) * r);
        p.vertex(p.cos(a - tw * 0.8) * r * 1.16, p.sin(a - tw * 0.8) * r * 1.16);
        p.vertex(p.cos(a + tw * 0.8) * r * 1.16, p.sin(a + tw * 0.8) * r * 1.16);
        p.vertex(p.cos(a + tw) * r, p.sin(a + tw) * r);
        p.endShape();
      }
      // Spin marks in the hub.
      p.stroke(HI[0], HI[1], HI[2], 90);
      p.strokeWeight(0.9);
      for (let i = 0; i < 5; i++) {
        p.arc(0, 0, r * (0.34 + i * 0.07), r * (0.34 + i * 0.07), p.random(p.TWO_PI), p.random(p.TWO_PI) + 2.2);
      }
    }
    p.pop();
  }

  function wobble(r) {
    p.beginShape();
    for (let a = 0; a <= p.TWO_PI + 0.01; a += 0.08) {
      const n = p.noise(p.cos(a) * 1.4 + 10, p.sin(a) * 1.4 + 10, r * 0.01);
      const rr = r * (0.985 + n * 0.03);
      p.vertex(p.cos(a) * rr, p.sin(a) * rr);
    }
    p.endShape();
  }

  function leaders() {
    p.stroke(40, 26, 44, 150);
    p.strokeWeight(1);
    for (let i = 0; i < TRAIN.length - 1; i++) {
      const a = TRAIN[i];
      const b = TRAIN[i + 1];
      dashed(a.x, a.y, b.x, b.y, 9, 7);
    }
    p.stroke(40, 26, 44, 110);
    dashed(790, 170, 790, 560, 5, 6);
    p.push();
    p.noFill();
    p.stroke(120, 96, 122, 90);
    p.strokeWeight(1);
    p.ellipse(790, 300, 190, 46);
    p.ellipse(690, 900, 150, 40);
    p.pop();
    p.push();
    p.noStroke();
    p.fill(198, 40, 40, 220);
    p.rect(40, 228, 22, 12);
    p.pop();
  }

  function tally(x, y, n) {
    p.stroke(INK[0], INK[1], INK[2], 230);
    p.strokeWeight(2.4);
    let cx = x;
    for (let i = 0; i < n; i++) {
      if (i > 0 && i % 5 === 0) cx += 12;
      if (i % 5 === 4) p.line(cx - 34, y + 16, cx + 4, y - 12);
      p.line(cx + p.random(-1, 1), y - 12, cx + p.random(-1, 1), y + 16);
      cx += 9;
    }
  }

  // ---- type ---------------------------------------------------------------

  function notes() {
    for (let i = 0; i < LEFT_NOTES.length; i++) {
      const y = 1058 + i * 26;
      letter(520, y, LEFT_NOTES[i][0], 13, INK, 0.95);
      letter(552, y, LEFT_NOTES[i][1], 13, INK, 0.9);
    }
    for (let i = 0; i < RIGHT_NOTES.length; i++) {
      const y = 1058 + i * 26;
      letter(742, y, RIGHT_NOTES[i][0], 13, INK, 0.95);
      letter(772, y, RIGHT_NOTES[i][1], 13, INK, 0.9);
    }
    letter(548, 1330, 'TOTAL 33', 15, INK, 0.95);
    p.stroke(INK[0], INK[1], INK[2], 190);
    p.strokeWeight(1.4);
    p.line(546, 1340, 660, 1340);
  }

  function marginType() {
    p.noStroke();
    p.textFont('monospace');
    p.fill(70, 60, 78, 190);
    p.textSize(11);
    p.text('CONT FROM 2026-06-20', 812, 76);
    p.text('092', 950, 430);
    p.text('5 OF 9', 40, 1372);
    p.text('059', 520, 320);
    p.fill(198, 40, 40, 210);
    p.textSize(13);
    p.text('NOTE: 23', 388, 268);
    p.stroke(198, 40, 40, 200);
    p.strokeWeight(1.6);
    p.line(388, 272, 470, 268);
  }

  function specks() {
    p.noStroke();
    for (let i = 0; i < 260; i++) {
      p.fill(40, 26, 44, p.random(60, 190));
      const x = p.random(W);
      const y = p.random(H);
      if (p.noise(x * 0.004, y * 0.004) < 0.52) continue;
      p.rect(x, y, p.random(1, 3), p.random(1, 2));
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
      p.translate(cx, y + p.random(-0.8, 0.8));
      p.rotate(p.random(-0.02, 0.02));
      p.fill(col[0], col[1], col[2], 255 * alpha);
      p.text(ch, 0, 0);
      p.pop();
      cx += size * 0.62 + p.random(-0.6, 1.2);
    }
    p.pop();
  }

  function dashed(x1, y1, x2, y2, on, off) {
    if (on <= 0) return;
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
