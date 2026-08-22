# Contributing

Thanks for taking a look. This is a small app — one Vite + React page, no backend, no server to run.

```sh
npm install
npm run dev     # http://localhost:5173
npm run build   # type-check and bundle
npm run lint    # oxlint
```

## Where things live

| Path | What it is |
| --- | --- |
| [src/App.tsx](src/App.tsx) | the whole page: controls, prompt, output panes |
| [src/components/](src/components/) | the Windows 98 widgets (title bar, menus, group boxes, bevels) |
| [src/lib/systemPrompt.ts](src/lib/systemPrompt.ts) | the house style: fixed materials, the six-layer page anatomy, the craft rules and the density bar |
| [src/lib/llm.ts](src/lib/llm.ts) | the three provider calls, each asking for structured JSON |
| [src/lib/p5runner.ts](src/lib/p5runner.ts) | compiles and mounts the generated sketch, guards it, exports PNG |
| [src/lib/presets/](src/lib/presets/) | the reference plates that ship with the app |

## The sketch contract

Generated and bundled sketches obey the same rules, so anything you can paste into the editor also runs as a preset:

- one top-level `function sketch(p) { … }`, instance mode
- every p5 call goes through `p.` — there are no globals
- `p.createCanvas(...)` first inside `p.setup`
- no external resources: no `loadImage`, `loadFont`, `loadShader`, `preload`, no fetch, no addon libraries
- seed with `p.randomSeed(n)` and `p.noiseSeed(n)` so the piece is reproducible
- pages are portrait `1000 × 1400`, drawn progressively across frames, and call `p.noLoop()` when finished

## Adding a reference plate

Write it as a `String.raw` template in a new file under [src/lib/presets/](src/lib/presets/), then add an entry to [src/lib/presets/index.ts](src/lib/presets/index.ts) with a title, a one-sentence description of the technique, and its motion. Keep it self-contained and original — plates are the quality bar for the generator, so they should be worth looking at closely.

## House style

The materials are deliberately fixed — graphite and ink on cream paper with one accent — so quality does not depend on the user picking well. Marks wobble, pressure varies, tone comes from accumulation rather than flat fills, and the paper is always visible. A patch that adds material choices back, or that makes output look more like a chart and less like a kept document, is going the wrong way.
