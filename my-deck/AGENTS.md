# open-slide — Agent Guide

The deck workspace is this directory (`my-deck/`). Run `npm run dev` and all `slides/`, `themes/`, and `node_modules/` paths below are relative to here.

You are authoring **slides** in this repo. Every slide is arbitrary React code that you write.

## Hard rules

- Put your slide under `slides/<kebab-case-id>/`.
- The entry is `slides/<id>/index.tsx`.
- Put slide-specific images/videos/fonts under `slides/<id>/assets/`. For assets reused across decks or themes (logos, avatars), use the global `assets/` folder and import via `@assets/...`.
- Do **not** touch `package.json`, `open-slide.config.ts`, or other slides.
- Do not add dependencies. Use only `react` and standard web APIs.

## Which skill to use

Skills live in `.cursor/skills/`. Read the relevant `SKILL.md` when a workflow applies:

- **Drafting a new deck** — `create-slide`. Scoping questions, structure, and hand-off.
- **Applying inspector comments** (`@slide-comment` markers in a page) — `apply-comments`.
- **Creating or extracting a theme** — `create-theme`. Themes live as markdown under `themes/<id>.md` and are read by `create-slide` before authoring.
- **Resolving "this page" / "this element"** — when the user references the current slide or selection without naming it, read `current-slide`. It reads the dev server's `node_modules/.open-slide/current.json` for slide, page, and inspector-picked element.
- **Any other slide edit** — read `slide-authoring` before writing. File contract, 1920×1080 canvas, type scale, palette, layout, assets, self-review checklist, and anti-patterns. `create-slide` and `apply-comments` defer to it for the *how*.

Keep this file short: hard rules only. Deeper guidance lives in the skills above.

## Updating skills

Built-in skills ship with `@open-slide/core`. Cursor-specific copies live in `.cursor/skills/`.

To pull upstream skill updates from the package:

```bash
npm update @open-slide/core
npm run sync:skills
```

Then re-copy or re-apply Cursor adaptations to `.cursor/skills/` — `sync:skills` writes to `.agents/skills/` and `.claude/skills/` (Claude Code format), not `.cursor/skills/`.

`npm run dev` detects drift on startup and offers to sync. Preview changes with `npm exec open-slide sync:skills --dry-run`.

## Cursor Cloud specific instructions

All commands run from `my-deck/` (the deck workspace). Standard scripts live in `package.json` and `README.md`: `npm run dev` (dev server), `npm run build` (static build, also serves as the typecheck — there is no separate lint script), `npm run preview`.

- **`npm run dev` blocks on an interactive skills-drift prompt** (`Skills out of date … Sync now? (Y/n)`) when the bundled `@open-slide/core` skills differ from `.cursor/skills/`. In a non-interactive/automated context use `npm exec open-slide dev -- --no-skills-check` (or answer `n`) so startup doesn't hang. Do **not** accept the sync — it rewrites `.agents/`/`.claude/` skill copies, not `.cursor/`.
- Dev server defaults to `http://localhost:5173/`; override with `--port`. The home page lists every folder under `slides/`; click a deck to view/navigate pages (Arrow keys / PageUp / PageDown, `F` for fullscreen).
- `npm run build` writes to a repo-root `dist/` (the deck's parent), not `my-deck/dist/`; the verbose `../../../../../dist/...` paths in build output are expected.
- Hot reload picks up new/edited `slides/<id>/index.tsx` files live — no restart needed to see a new deck.
