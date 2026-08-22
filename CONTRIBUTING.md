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
| [src/lib/systemPrompt.ts](src/lib/systemPrompt.ts) | what the model is told to draw and how |
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
- still pieces call `p.noLoop()` when finished; heavy ones draw progressively across frames rather than blocking one

## Adding a reference plate

Write it as a `String.raw` template in a new file under [src/lib/presets/](src/lib/presets/), then add an entry to [src/lib/presets/index.ts](src/lib/presets/index.ts) with a title, a one-sentence description of the technique, and its motion. Keep it self-contained and original — plates are the quality bar for the generator, so they should be worth looking at closely.

## House style

The whole app aims at work that looks made by hand. Marks wobble, pressure varies, tone comes from accumulation rather than flat fills, and the paper is always visible. A patch that makes output look more like a chart and less like a drawing is going the wrong way.
