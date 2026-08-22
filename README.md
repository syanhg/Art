# p5 Art Generator

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**Live: [syanhg.github.io/Art](https://syanhg.github.io/Art/)**

A single-page, no-backend app that turns one line of description into a whole hand-drawn page: an LLM writes a p5.js sketch, and that sketch draws the sheet for real, live, in your browser.

The UI is a Windows 98-styled desktop app.

## How it works

1. You pick a provider, paste your own API key, and say what the page should record. That is the whole interface — the materials are fixed, not chosen.
2. The app sends your prompt + a hardcoded system prompt + those controls directly to the provider's API from your browser, requesting a structured JSON response: `{ title, description, sketchCode }`.
3. The returned source is shown read-only in a Monaco editor and executed as an instance-mode p5 sketch (`function sketch(p) { … }`) mounted straight into the page, drawing itself progressively.
4. You can copy the sketch, save it as a `.js` file, export the page as a PNG, run it again, or "Remix."

Your API key is stored only in `localStorage` and is sent directly to the provider's API (OpenAI / Anthropic / Google).

## The house style

One fixed set of materials, so every prompt gets the same finish: graphite and black ink on warm off-white paper with heavy tooth, a pale printed grid with dashed section rules and margin numbers, and exactly one accent per page — magenta, vermilion, olive-and-mustard, dusty plum or pale blue.

Every page is a portrait sheet built from six layers, in order:

1. **Ground** — paper, tooth, uneven blotching, an edge shadow
2. **Ruling** — the printed grid, dashed section rules, margin numbers, a red margin line
3. **Header** — a hand-lettered title and date, underlined with an overshooting rule
4. **Body** — the drawing the prompt asks for, made from marks rather than fills
5. **Annotation** — columns of clipped clerical lines on ruled underlines, some struck through
6. **Furniture** — page numbers, sheet counts, ink specks, blots, a smudge

The model invents the words too: the title, the date, and eight to sixteen annotation lines in the register of someone recording something they do not intend anyone else to read. Paragraph-length passages are drawn as pseudo-writing — loops that read as handwriting from a distance and dissolve up close.

## Reference sketches

Four plates ship with the app and run without an API key (**References** menu). They are the quality bar the generator aims at:

| Sketch | Technique |
| --- | --- |
| The Wall, Done | hatched blocks, Gaussian stipple patches and ink bars on graph paper |
| Washes Against the Wall | gouache cells overprinted in `MULTIPLY` on a printed engineering grid |
| Skips by the Radiator Pipe | exploded gear train with blurred graphite smudges and dashed leaders |
| Nine Vessels, Stippled | solids of revolution from random easing curves, drawn as dot rings — technique after [newyellow's *Zen Pots*](https://openprocessing.org/sketch/2036000) |

## Contributing

Bug reports, new reference plates and prompt improvements are all welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) for the layout and the sketch contract every plate follows.

## Running it

```sh
npm install
npm run dev
```

`npm run build` type-checks and bundles to `dist/`; pushes to `main` deploy to [GitHub Pages](https://syanhg.github.io/Art/) via [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

## Safety note

Generated source is executed in the page (same origin) so the canvas stays readable for PNG export. Before it runs it is screened for APIs a drawing sketch has no reason to touch — `fetch`, `XMLHttpRequest`, `WebSocket`, storage, dynamic `import` — and `setup`/`draw` are wrapped so a bad frame surfaces as a message instead of an endless console spew.

## Credits

- [p5.js](https://p5js.org) does the drawing. It is licensed **LGPL-2.1**, and the production bundle includes it; that licence is satisfied here by this repository being public, so anyone can swap the dependency and rebuild.
- *Nine Vessels, Stippled* uses a dot-density rendering approach I learned from [newyellow's *Zen Pots*](https://openprocessing.org/sketch/2036000). The sketch is written from scratch — only the technique is borrowed.
- The Windows 98 icons in `public/icons/` come from a third-party icon pack: **TODO — add the pack's name, author and licence here before release.**
- UI chrome carried over from my earlier [Mathematical Visualizer](https://github.com/syanhg/Asset).

## License

[MIT](LICENSE) © Seungyong
