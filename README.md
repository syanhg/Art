# p5 Art Generator

A single-page, no-backend app that turns a natural-language prompt into generative art: an LLM writes a p5.js sketch, and that sketch runs for real, live, in your browser.

The UI is a Windows 98-styled desktop app.

## How it works

1. You pick a provider and paste your own API key, plus a prompt and a few design controls (category, palette, style, background, motion).
2. The app sends your prompt + a hardcoded system prompt + those controls directly to the provider's API from your browser, requesting a structured JSON response: `{ title, description, sketchCode }`.
3. The returned source is shown read-only in a Monaco editor and executed as an instance-mode p5 sketch (`function sketch(p) { … }`) mounted straight into the page, so animated pieces really animate.
4. You can copy the sketch, save it as a `.js` file, export the canvas as a PNG, re-run it, pause it, or "Remix."

Your API key is stored only in `localStorage` and is sent directly to the provider's API (OpenAI / Anthropic / Google).

## Reference sketches

Six pieces ship with the app and run without an API key. They are the quality bar the system prompt aims at, and it quotes their techniques:

| Sketch | Technique |
| --- | --- |
| The Wall, Done | hatched blocks, Gaussian stipple patches and ink bars on graph paper |
| Washes Against the Wall | gouache cells overprinted in `MULTIPLY` on a printed engineering grid |
| Skips by the Radiator Pipe | exploded gear train with blurred graphite smudges and dashed leaders |
| Nine Vessels, Stippled | solids of revolution from random easing curves, drawn as dot rings — technique after [newyellow's *Zen Pots*](https://openprocessing.org/sketch/2036000) |
| Slow Weather | 2,600 particles advected through a two-octave Perlin field, additive inferno ramp |
| De Jong, Counted Twice | 12M iterations of the De Jong map, density buffer, log tone mapping through viridis |

## Running it

```sh
npm install
npm run dev
```

`npm run build` type-checks and bundles to `dist/`; pushes to `main` deploy to GitHub Pages.

## Safety note

Generated source is executed in the page (same origin) so the canvas stays readable for PNG export. Before it runs it is screened for APIs a drawing sketch has no reason to touch — `fetch`, `XMLHttpRequest`, `WebSocket`, storage, dynamic `import` — and `setup`/`draw` are wrapped so a bad frame surfaces as a message instead of an endless console spew.
