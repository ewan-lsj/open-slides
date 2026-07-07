---
name: run-editable-dev
description: Run the my-deck dev server on port 5174 using the local open-slide-framework core, which includes the unreleased editable PPTX export ("Export as PPTX" with native text/shapes). Use when the user asks to run the editable/unreleased/native PPTX export version, test framework changes against the real deck, or run the deck on 5174.
---

# Run the unreleased editable-export dev server

The published `@open-slide/core` in `my-deck/node_modules` (currently `1.10.0`) only ships the image-based PPTX export. The **editable** "Export as PPTX" (native text, shapes, raster fallback) lives unreleased in the `open-slide-framework/` source. This skill builds that local core and serves `my-deck`'s real slides with it on port **5174**.

## Layout assumption

Both projects sit side by side in this workspace:

```
open-slides/
├── my-deck/                 # your deck (slides live here)
└── open-slide-framework/    # framework source with the editable export
```

## Steps

Run from `my-deck/` unless noted.

1. **Install framework deps** (first time only, or if `open-slide-framework/node_modules` is missing):

```bash
cd ../open-slide-framework && pnpm install
```

2. **Build the local core** (produces `dist/`; re-run after pulling new framework changes):

```bash
cd ../open-slide-framework && pnpm --filter @open-slide/core build
```

3. **Start the dev server against your deck on 5174**:

```bash
node ../open-slide-framework/packages/core/bin.js dev --port 5174 --no-skills-check
```

`dev` reads slides from the current working directory (`process.cwd()`), so running it from `my-deck/` serves your real slides — while the runtime (including the editable export) comes from the local framework core. This is a long-running process; start it in the background.

## Verify

- Open http://localhost:5174/
- Open any slide → download / overflow menu → **Export as PPTX** (the `Presentation`-icon item). It now generates a native, editable deck instead of the image-based one.

## Notes

- **Port 5173 vs 5174:** if your original `npm run dev` (the old `1.10.0` package) is still running, it holds 5173 and only offers image PPTX. Always use **5174** for the editable version. `--port 5174` pins it; omit the flag to let Vite pick the next free port.
- `--no-skills-check` suppresses the `slide-authoring skills out of date` drift prompt/warning — harmless either way.
- Requires `pnpm` and Node ≥ 18.
- This does **not** modify `my-deck/package.json`; it just runs a different `open-slide` binary against the same slides.
