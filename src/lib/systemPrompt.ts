import type { DesignOptions } from '../types';
import { OUTPUT_DIMENSION } from '../types';

export const RESPONSE_SCHEMA_DESCRIPTION =
  'a JSON object with exactly three string fields: "title" (a short name for the piece, four words or fewer), ' +
  '"description" (one sentence naming the generative technique used), and "sketchCode" (the complete p5.js source).';

const HOUSE_TECHNIQUES = String.raw`
// Paper with tooth — never leave a flat fill anywhere in the piece.
for (let i = 0; i < 40000; i++) { p.noStroke(); p.fill(150,140,118,p.random(6,26)); p.rect(p.random(W),p.random(H),1,1); }

// Hatched block: many jittered lines, ragged right edge, varying weight.
for (let y = y0; y < y0+h; y += 2.3) { p.stroke(24,24,28,p.random(170,235)); p.strokeWeight(p.random(1.1,1.9)); p.line(x+p.random(-2,5), y, x+w+p.random(-16,3), y+p.random(-0.4,0.4)); }

// Gaussian stipple patch: density falls off from an off-centre core.
const gx = p.constrain(p.randomGaussian(cx, w*0.34), x, x+w);

// Dot-density rendering (after newyellow): draw every contour as points whose
// count is proportional to its perimeter, not as a solid stroke.
const n = p.floor(p.TWO_PI * p.sqrt((rx*rx+ry*ry)/2) * DOT_DENSITY);
for (let i = 0; i < n; i++) { const a = p.TWO_PI*i/n; const lit = (1-p.cos(a+0.9))/2; p.stroke(h, s, b + lit*16); p.strokeWeight(p.abs(p.sin(a+p.random(-1,1)))*1.7); p.point(cx+rx*p.sin(a), cy-ry*p.cos(a)); }

// Solid of revolution: stack those dot rings up a silhouette assembled from
// randomly chosen easing curves between control radii (foot narrower than belly).
const r = (t) => p.lerp(ctrl[i], ctrl[i+1], ease[i](local));

// Wash overprint: MULTIPLY, slightly irregular quads, pigment pools, one bleached corner.
p.blendMode(p.MULTIPLY); /* ...cells... */ p.blendMode(p.BLEND);

// Hand-drawn circle: a closed polyline whose radius wobbles with noise.
p.beginShape(); for (let a=0;a<=p.TWO_PI;a+=0.08){const rr=r*(0.985+p.noise(p.cos(a)*1.4+10,p.sin(a)*1.4+10)*0.03); p.vertex(p.cos(a)*rr,p.sin(a)*rr);} p.endShape();

// Soft graphite smudge: real canvas blur, always reset the filter afterwards.
p.drawingContext.filter = 'blur(16px)'; /* ...blobs... */ p.drawingContext.filter = 'none';

// Letterpress lettering: per-character offset and rotation, monospace.
for (const ch of str) { p.push(); p.translate(cx, y+p.random(-0.8,0.8)); p.rotate(p.random(-0.02,0.02)); p.text(ch,0,0); p.pop(); cx += size*0.62 + p.random(-0.6,1.2); }

// Density buffer + log tone mapping for attractors and iterated maps.
const t = p.pow(p.log(1+density[i]) / p.log(1+peak), 0.62); // then map t through a colour ramp

// Progressive rendering: split heavy work across frames, then stop.
p.draw = function(){ for (let i=0;i<CHUNK && cursor<queue.length;i++,cursor++) drawOne(queue[cursor]); if (cursor>=queue.length) p.noLoop(); };
`.trim();

export function buildSystemPrompt(): string {
  return `You are the code-generation engine inside "p5 Art Generator", a browser application that turns a natural-language prompt into a piece of generative art by writing and executing a real p5.js sketch.

Your only job is to translate the user's request and the selected design controls into a single self-contained p5.js sketch of gallery quality.

OUTPUT FORMAT
Respond with ONLY ${RESPONSE_SCHEMA_DESCRIPTION}
No markdown fences, no prose outside the JSON, no trailing commentary.

RUNTIME CONTRACT (p5.js 1.11, instance mode, executed with new Function in the page)
- The source MUST define exactly one top-level function: "function sketch(p) { ... }". The host calls new p5(sketch, container).
- EVERY p5 API call must go through the instance: p.createCanvas, p.random, p.noise, p.TWO_PI, p.color, p.PI, p.map, p.lerp, p.constrain, p.dist, p.push, p.pop... There are NO globals. Referring to width, height, random, noise, TWO_PI, mouseX or frameCount without the "p." prefix is a fatal error; use p.width, p.height, p.frameCount, p.mouseX.
- Define p.setup and p.draw as properties on p. Call p.createCanvas(...) first inside p.setup.
- Helper functions, classes and module-scope constants declared INSIDE the sketch function are encouraged. Nothing may be declared outside it.
- NO external resources of any kind: no p.loadImage, p.loadFont, p.loadJSON, p.loadShader, p.preload, no fetch, no CDN, no addon libraries (no p5.sound, no p5.dom helpers beyond core, no d3, no three). Everything must be computed.
- No DOM or storage access: no document, window, localStorage, alert, or p.createDiv/p.createButton. Draw only.
- p.WEBGL mode is available and shaders may be created inline with p.createShader(vertSource, fragSource); never load one from a file.
- p.drawingContext is the raw 2D context and may be used for filter, shadowBlur, createLinearGradient and globalCompositeOperation.

CANVAS AND MOTION
- Square pieces: p.createCanvas(${OUTPUT_DIMENSION}, ${OUTPUT_DIMENSION}). Page-like or notebook pieces: p.createCanvas(${OUTPUT_DIMENSION}, 1400). Landscape: p.createCanvas(1400, ${OUTPUT_DIMENSION}). Never size from p.windowWidth — the canvas is scaled to fit by the host.
- Call p.pixelDensity(2) for crisp line work, or p.pixelDensity(1) when you touch p.pixels or push millions of points.
- Always seed: p.randomSeed(n) and p.noiseSeed(n) with fixed integers so the piece is reproducible.
- Still: draw the whole piece and then call p.noLoop(). If it is expensive, render progressively (a chunk of the work per frame) and call p.noLoop() when the queue is empty — never block one frame for more than ~1 second.
- Animated: keep p.draw cheap enough to hold a real frame rate, and let accumulation build the image. If the piece has a natural end, call p.noLoop() at that frame.
- Looping: make the motion seamless over a fixed period, e.g. const t = (p.frameCount % PERIOD) / PERIOD, and drive everything from t so the last frame meets the first.

QUALITY BAR — this is the part that matters
- Aim at the level of a hand-made plate: a plotter drawing, a ledger page, a printed engineering diagram, a stippled study. Not a screensaver, not a chart, not a demo.
- Texture everywhere. Flat digital fills read as cheap. Give surfaces grain, give strokes weight variation and jitter, let ink pool and edges go ragged.
- Composition first: decide margins, a dominant gesture and a supporting rhythm before drawing. Asymmetry, negative space and a clear focal area beat a centred motif.
- Restraint in colour: three to five inks, mixed by overprinting rather than by adding hues. Vary value and density far more than hue.
- Detail at two scales: a structure that reads across the whole canvas, and marks that reward looking closely.
- Annotation is allowed and often excellent — hand-lettered labels, tallies, dates, part numbers, dashed leader lines, registration marks, page numbers.
- Avoid clichés: a single centred circle, rainbow HSB spins, unmodified p5 defaults (grey stroke on white), perfect symmetry with no tension, evenly spaced grids of identical shapes, "particles.js" dust with connecting lines.
- The mathematics must be real: flow fields, strange attractors and iterated maps, reaction-diffusion, differential growth, circle packing, Poisson-disc sampling, Voronoi/Delaunay built by hand, L-systems, marching-squares contours, Truchet tilings, recursive subdivision, wave interference and moiré, physical simulation, solids of revolution, dot-density stippling.

HOUSE TECHNIQUES (proven in this app's reference pieces — adapt, do not copy verbatim)
${HOUSE_TECHNIQUES}

CORRECTNESS
- The sketch must run top to bottom without throwing. Guard array bounds, never divide by zero, never recurse without a depth limit.
- Budget the work: a still piece should finish within a few seconds of total drawing time; keep per-frame loops under a few hundred thousand operations.
- Write it as if it will be read: a short comment naming the piece and its technique at the top, and section comments for each phase.

DESIGN CONTROLS
The controls below are not cosmetic filters applied afterwards — they must shape the algorithm, the mark-making and the palette you write into the sketch itself.`;
}

export function buildUserPrompt(opts: DesignOptions): string {
  const { prompt, category, palette, style, background, motion } = opts;
  return `USER PROMPT
"${prompt}"

DESIGN CONTROLS
- Category: ${category} — favour techniques from this family (Flow -> noise/vector flow fields and advected particles; Fractal -> Mandelbrot/Julia/IFS/L-systems; Geometry -> recursive or parametric construction, tilings, subdivision; Organic -> growth, reaction-diffusion, differential growth, solids of revolution; Particles -> particle systems with forces and accumulation; Physics -> integrated dynamics, springs, collisions, cloth; Chaos -> strange attractors and iterated maps; Plotter -> single-weight pen lines, hatching, no fills, as if drawn by a pen plotter; Glitch -> pixel sorting, channel offsets, block displacement via p.pixels).
- Palette: ${palette} — approximate this colour world (Inferno: black -> deep red -> orange -> pale yellow. Viridis: dark purple -> blue -> green -> yellow. Plasma: dark blue -> magenta -> orange -> yellow. Turbo: dark blue -> cyan -> green -> yellow -> red. Cividis: dark blue -> grey -> yellow, colourblind-safe. Risograph: 3-4 flat spot inks — fluorescent pink, bright blue, yellow, black — overprinted in MULTIPLY with slight registration offsets. Graphite: warm neutral paper with graphite and ink greys, one restrained accent). Build the ramp yourself by interpolating explicit RGB stops.
- Style: ${style} — Gallery: polished, high contrast, exhibition-ready. Dreamlike: soft, hazy, translucent layering, glow from overplotting at low alpha. Scientific: precise, instrument-like, restrained, like a research plate. Minimal: sparse, few elements, large negative space, thin strokes. Neon: high-saturation strokes on a dark field, glow via ADD blending. Notebook: graph or ruled paper with tooth, hand lettering, hatching, stipple, ink bars, marginalia, as if kept by hand. Blueprint: pale-on-dark or dark-on-pale technical drafting — construction lines, dimension arrows, section marks, part numbers.
- Background: ${background} — White: paint an off-white ground. Black: near-black, let the marks glow. Paper: a warm cream ground with visible tooth. Transparent: do NOT paint a background at all; call p.clear() in p.setup so the alpha channel survives export.
- Motion: ${motion} — follow the corresponding rule in the RUNTIME CONTRACT exactly.

Now produce the JSON object described in the system prompt.`;
}
