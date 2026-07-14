---
name: pptx-design
description: >-
  Design open-slide pages so Export → PPTX yields editable PowerPoint/Google
  Slides shapes for boxes and diagrams. Use data-pptx-raster only for graphs
  and charts. Use when building or editing decks for PPTX export, when boxes or
  diagrams export as images, when connectors look like slim grey boxes, when
  card borders vanish after export, or when deciding whether to mark
  data-pptx-raster.
---

# PPTX-friendly slide design

Native PPTX export turns boxes into **shapes + text** editable in PowerPoint /
Google Slides. **Only graphs and charts** should intentionally bake to images
(`data-pptx-raster` / `<canvas>`).

Export runs in the browser against the running open-slide dev server
(`ensure-dev-server`).

## Decide first

| Editable (native shapes + text) | Image layer |
| --- | --- |
| Card / tile / story-box grids | Graphs, charts, plots (`data-pptx-raster`) |
| Flow pipelines with text `→` | SVG connector drawings (auto-raster) |
| Node cards in a topology | Decorative washes / gradients |
| Stair tiles, harness panels, pull-quotes | — |

### Hard anti-patterns

```tsx
// ❌ Slim filled divs are not lines — they look like grey boxes in browser + PPTX
<div style={{ position: 'absolute', width: 380, height: 3, background: '#E3E2DD' }} />

// ❌ Near-same fill as the page — cards vanish when strokes drop in Google Slides
<div style={{ background: '#0C0C0C', border: '2px solid #E4002B' }} /> // on #000

// ❌ Outline-only cards (transparent / page-matched fill) — PPTX text with no box
<div style={{ background: 'transparent', border: '2px solid #E4002B' }} />

// ❌ Rasterizing the whole diagram of boxes
<div data-pptx-raster>
  <Node />
  <Node />
</div>
```

## Connectors (do this instead)

PPTX has no free “CSS line” primitive from a thin `div`. Pick one:

### 1. Text arrows between editable cards (best for flows)

```tsx
<div style={{ display: 'flex', alignItems: 'stretch' }}>
  <FlowCard label="…" detail="…" />
  <span style={{ width: 56, alignSelf: 'center', textAlign: 'center', fontSize: 36 }}>→</span>
  <FlowCard label="…" detail="…" accent />
</div>
```

### 2. SVG lines under editable cards (topology / diagonals)

Keep **cards as sibling `div`s** (editable shapes). Put connectors in an `<svg>`
sibling — SVG is auto-rasterized as a line layer; nodes stay shapes.

```tsx
<div style={{ position: 'relative', width: '100%', height: 420 }}>
  <svg
    width="100%"
    height="420"
    viewBox="0 0 1700 420"
    preserveAspectRatio="none"
    style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
  >
    <line x1="850" y1="140" x2="180" y2="70" stroke="#E3E2DD" strokeWidth="3" />
    {/* … */}
  </svg>
  <Node style={{ position: 'absolute', left: 0, top: 10, width: 360, height: 110 }} … />
  {/* more nodes — not inside the svg */}
</div>
```

Do **not** wrap the nodes in `data-pptx-raster` with the SVG.

### 3. Short column stems only (plan trees)

A short vertical stem under a single parent in a **flex column** can stay a
thin filled `div` (`width: 2`, small `height`) when it reads as a stem, not a
floating line across the canvas. Prefer text `→` / redesign if it starts to
look like a grey sliver.

## Editable card recipe

**One card = one editable object in PPTX.** Export merges a filled/bordered
container and its text into a **single text frame** with fill + stroke (not a
bare rectangle with a floating text box on top).

**Separation comes from fill, not stroke alone.** Cards must still read as boxes
after export even if a stroke is thinned by PowerPoint / Google Slides.

```tsx
// Dark page (#000) — lighter charcoal panel + visible stroke
const Card = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      boxSizing: 'border-box',
      background: '#2E2E2E', // clearly lighter than page bg
      border: '2px solid #5C5C5C', // optional but survives when on the same frame as text
      borderRadius: 4,
      padding: 28,
    }}
  >
    {children}
  </div>
);

// Light page — white / soft tile that contrasts the canvas
const LightCard = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      boxSizing: 'border-box',
      background: '#FFFFFF',
      borderRadius: 4,
      padding: 28,
    }}
  >
    {children}
  </div>
);
```

### Fill contrast (required)

| Page background | Card fill | Avoid |
| --- | --- | --- |
| `#000000` / near-black | `#2A2A2A`–`#3A3A3A` (visible charcoal) | `#0C0C0C`, transparent, page-matched |
| Cream / light grey | White or soft off-white tile | Same as page, outline-only |
| Mid tone | One step lighter or darker | Hairline stroke as the only cue |

Keep brand accent in **typography / labels**, not as the sole box outline.

Put **text directly inside** the filled `div` (or in transparent wrappers —
labels + body). Do **not** nest a second filled box for the text. Nested cards
with their own fill stay separate objects.

### Borders (on the same card element)

- Prefer fill contrast first; add a uniform `border: '2px solid …'` on the **same**
  element as the fill when you want a visible outline after export
- Hairlines vanish in Google Slides — author at **≥2px**
- One-sided accents (`borderLeft` only) export as a strip — fine for callouts
- Exporter floors stroke width at **1pt**; fill + stroke live on the text frame

**Accent:** put brand color on labels / one-sided bars on the **same** element.
Never a child bar `div`. **Grids:** transparent wrappers. No `boxShadow` on
editable chrome (shadows don’t become PPTX strokes).

## When to use `data-pptx-raster`

**Only** graphs/charts (and rare decorative washes):

```tsx
<div data-pptx-raster style={{ width: '100%', height: 420 }}>
  <RevenueChart />
</div>
```

Keep titles outside. Never mark card grids or flows of boxes.

## What forces an accidental raster

| CSS / markup | Effect |
| --- | --- |
| `data-pptx-raster` on a diagram of boxes | Whole region becomes one image |
| `<svg>` | That SVG bakes to an image (OK as a connector layer) |
| `transform: rotate(…)` | Atomic raster |
| gradient / `filter` / mask / `clip-path` | Raster that element |
| Outer shell + inner fill | Double stacked boxes |

## Hard rules

1. **Raster only graphs/charts** — not diagrams of boxes.
2. **Never fake lines with 2–3px filled divs** spanning between nodes.
3. **Topology connectors = SVG sibling**; **flows = text `→`**.
4. **One visual card = one clearly contrasted fill** (text lives inside that
   same `div`) — not outline-only / near-page fill / shape-under-floating-text.
5. **Grid/flex wrappers stay transparent.**
6. **Explicit card instances**, not `array.map`.

## Self-check

- [ ] No slim grey “line boxes” between nodes
- [ ] Topology uses SVG lines; cards are sibling shapes
- [ ] Flows use text `→` between cards
- [ ] Every text card has a fill that is clearly lighter/darker than the page (not outline-only)
- [ ] Dark-on-dark cards use charcoal panels (`~#2E2E2E` on `#000`), not `#0C0C0C` + red stroke alone
- [ ] Card text is inside the filled `div` (exporter on that same element if needed)
- [ ] No `data-pptx-raster` except graphs/charts
- [ ] After export: each card selects as **one** filled text frame (not a grey rect under a separate text box); SVG connectors are one image layer; charts are images

## Related

- `slide-authoring` — canvas, type, layout
- `ensure-dev-server` — PPTX download needs Vite running
- `create-slide` — consult when the deck will export to PPTX / Google Slides
