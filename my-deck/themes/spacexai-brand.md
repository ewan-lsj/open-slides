---
name: SpaceXAI Brand Simple
description: Cursor Simple layout with SpaceXAI marks — light content slides, dark cover and closer only.
mode: light
---

# SpaceXAI Brand Simple

Same deck architecture as **Cursor Brand Simple** — light content field, dark cover/closer, title-top / body-centred pages, staggered fade-up. Swap every Cursor asset for the matching SpaceXAI file:

| Cursor slot | SpaceXAI asset | Where it goes |
| ----------- | -------------- | ------------- |
| `title_slide.svg` | `@assets/spacexai_background.png` | Full-bleed title-slide background |
| `LOCKUP_HORIZONTAL_2D_DARK.svg` | `@assets/spacexai - wordmark - white - transparent.png` | Title slide only — **bottom-right**, not top-left |
| *(no Cursor equivalent)* | `@assets/spacexai - wordmark - black - transparent.png` | Optional light-background wordmark — unused in default chrome |
| `cursor_dark.svg` (light cube) | `@assets/spacexai - symbol - white - transparent.svg` | Corner mark on dark content / closer |
| `cursor_light.svg` (dark cube) | `@assets/spacexai - symbol - black - transparent.png` | Corner mark on light content slides |

The SpaceXAI symbol is a wide X-trajectory, not a cube — keep the same corner pin (`top: 48; right: 48`) but use **height 40** so the mark does not run too wide. The wordmark is ~8:1 — cover mark is **height 48**, pinned bottom-right.

**No footer.** Do not render page numbers, wordmarks in a footer band, or “Confidential” / “Strictly Confidential” copy on any page.

## Palette

| Role            | Value     | Notes                                              |
| --------------- | --------- | -------------------------------------------------- |
| bg              | `#F7F7F4` | Main content slide background (warm off-white)     |
| text            | `#26251E` | Primary headings and body                          |
| accent          | `#3D4454` | Steel from the title-slide glow — bullets, stats, tile bars |
| muted           | `#9B9A92` | Section labels, captions                           |
| text-secondary  | `#5C5B54` | Supporting body copy                               |
| text-body       | `#3E3D36` | Body inside cards                                  |
| text-subtitle   | `#6B6A62` | Taglines inside cards                              |
| accent-alt      | `#5A6578` | Badges, secondary steel                            |
| tile-fill       | `#FFFFFF` | Tile/card fill — white, lifts off the `#F7F7F4` field |
| tile-shadow     | `0 2px 4px rgba(20,18,11,0.05), 0 6px 16px rgba(20,18,11,0.07)` | Soft tile elevation |
| card            | `#F7F7F4` | Legacy flat card fill (same as bg)                 |
| card-border     | `#E3E2DD` | Card / tile stroke                                 |
| card-01         | `#F0EFEB` | Nested card level 1                                |
| divider         | `#D9D9D9` | Horizontal rules                                   |
| heading-dark    | `#1A1A1A` | Alternate near-black headings                      |
| bg-dark         | `#020202` | Title and closing slides only (matches the background plate) |
| text-dark       | `#FFFFFF` | Hero title on the cover — sampled from the SpaceX title plate |
| text-dark-muted | `#999999` | Cover subtitle — medium gray from the same plate   |
| stat-muted      | `#868580` | Stat card descriptions                             |

## Typography

- Display font: `"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif` — bold for headings.
- Body font: same stack — regular 400–500 for body.
- Numeric tables (optional): `"Calibri", "Helvetica Neue", sans-serif` for tighter numerals.
- Type-scale overrides (1920 × 1080 canvas; scaled from PPTX pt guide):
  - Section label (Eyebrow): 22 px, bold, ALL CAPS
  - Page title (content): 64 px, bold, sentence case
  - Hero title (dark cover): 103 px, bold, `#FFFFFF` (measured from the SpaceX title plate)
  - Hero subtitle (dark cover): 139 px, regular, `#999999` — larger than the title; same optical height as the plate’s “Q3 2026”
  - Body text: 34 px, regular
  - Body secondary: 30 px, regular
  - Card heading: 32 px, bold
  - Card body: 28 px, regular
  - Stat number: 80 px, bold, accent color
  - Stat label: 28 px, bold, ALL CAPS

## Layout

- Canvas 1920 × 1080. Content padding: **110 px** from canvas edges (maps ~0.57" at 1920 width).
- **Logo in the corner (content + closer slides):** the SpaceXAI symbol is pinned `position: absolute; top: 48; right: 48; height: 40` — identical position and size on every content and closer page. Use the **white symbol on dark slides** and the **black symbol on light slides** (see `SpaceXAILogo` below). Never omit it or move it. The title slide is the one exception (see below).
- **Page composition (content slides):** the page root is a flex column. The title block (Eyebrow → Title) is pinned at the **top**; the body is **vertically centred** in the remaining space via the `Body` wrapper. Title at top, content centred — hold this on every content slide. **No footer band.**
- **Title slide (required — every deck opens with this):** a full-bleed `spacexai_background.png` (`<img>` pinned `inset: 0; width/height: 100%; objectFit: cover; zIndex: 0`) with the **white wordmark** pinned **bottom-right** (`bottom: 64; right: 48; height: 48`). The title block is **top-left** (`justifyContent: 'flex-start'`) in the 110 px padding — no lockup above it. `HeroTitle` is **white** (`#FFFFFF`); the subtitle is **medium gray** (`#999999`). No page numbers, no confidential line. See `CoverWordmark` and `Cover` below.
- **Closer (dark):** `bg-dark` background, content **centred** (`justifyContent: 'center'`) — a `HeroTitle` (e.g. "Thank you"), with the corner mark top-right in the white symbol. No footer.
- **Tiles (cards):** white fill `#FFFFFF` with the soft `tile-shadow` so they lift off the field; 1 px `#E3E2DD` border; 4–6 px steel accent bar at the top. In a grid, make **every tile equal height** with `gridAutoRows: '1fr'` + tile `height: '100%'`, and size them to the **smallest** that fits the tallest tile's content. **Never** stretch a tile grid to fill the page with `flex: 1` — that creates oversized boxes with whitespace. Let the centred `Body` balance the leftover space instead.
- Alignment: left-aligned content; 16–24 px gaps between tiles; generous vertical spacing between blocks.
- **Dark slides** (`bg-dark`) for cover and closer only — never for body content.
- Steel accent: sparingly — bullets, one stat, one accent bar per tile.

## Fixed components

These are paste-ready. Copy them verbatim into a slide that uses this theme.

### Eyebrow

```tsx
const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: '#9B9A92',
      marginBottom: 16,
      fontFamily: '"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif',
    }}
  >
    {children}
  </div>
);
```

### Title (content slide)

```tsx
const Title = ({ children }: { children: React.ReactNode }) => (
  <h1
    style={{
      fontSize: 64,
      fontWeight: 700,
      lineHeight: 1.15,
      letterSpacing: '-0.02em',
      margin: 0,
      color: '#26251E',
      fontFamily: '"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif',
    }}
  >
    {children}
  </h1>
);
```

### Hero title (title slide / closer)

Default is `#FFFFFF` — the cover title colour from the SpaceX plate. Keep it white on the closer too.

```tsx
const HeroTitle = ({
  children,
  color = '#FFFFFF',
}: {
  children: React.ReactNode;
  color?: string;
}) => (
  <h1
    style={{
      fontSize: 103,
      fontWeight: 700,
      lineHeight: 1.05,
      letterSpacing: '-0.03em',
      margin: 0,
      color,
      fontFamily: '"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif',
    }}
  >
    {children}
  </h1>
);
```

### Cover wordmark (title slide only)

The white SpaceXAI wordmark, pinned **bottom-right** on the title slide — same slot as the SpaceX mark on the reference plate. No confidential line beside it. Height is 48.

```tsx
import wordmarkWhite from '@assets/spacexai - wordmark - white - transparent.png';

const CoverWordmark = () => (
  <img
    src={wordmarkWhite}
    alt="SpaceXAI"
    style={{ position: 'absolute', bottom: 64, right: 48, height: 48, width: 'auto', zIndex: 1 }}
  />
);
```

### Cover (title slide — required)

Every deck's first slide is this exact treatment: full-bleed `spacexai_background.png`, white `HeroTitle` + gray subtitle top-left, white wordmark bottom-right. Copy verbatim and only change the title/subtitle copy. No footer, no page number, no confidential copy.

```tsx
import titleSlideBg from '@assets/spacexai_background.png';

const Cover: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: '#020202',
      color: '#FFFFFF',
      padding: 110,
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
    }}
  >
    <img
      src={titleSlideBg}
      alt=""
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
    />
    <Styles />
    <div className="brandFadeUp" style={{ position: 'relative', zIndex: 1 }}>
      <HeroTitle>Product Roadmap</HeroTitle>
      <p style={{ margin: '41px 0 0', fontSize: 139, fontWeight: 400, lineHeight: 1.05, color: '#999999' }}>
        Q3 2026
      </p>
    </div>
    <CoverWordmark />
  </div>
);
```

### SpaceXAI logo (corner — every slide except the title)

White symbol on dark slides; black symbol on light slides. Pass `onDark` on the closer.

```tsx
import symbolBlack from '@assets/spacexai - symbol - black - transparent.png';
import symbolWhite from '@assets/spacexai - symbol - white - transparent.svg';

const SpaceXAILogo = ({ onDark = false }: { onDark?: boolean }) => (
  <img
    src={onDark ? symbolWhite : symbolBlack}
    alt="SpaceXAI"
    style={{ position: 'absolute', top: 48, right: 48, height: 40, width: 'auto' }}
  />
);
```

### FadeUp (entrance animation)

Wrap any element to fade it up on mount. Pass `delay` to stagger; pass `fill` when wrapping a grid tile so it still stretches to equal height. Requires the `brandFadeUp` CSS from the Motion section.

```tsx
const FadeUp = ({ delay = 0, fill = false, children, style }: {
  delay?: number;
  fill?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <div
    className="brandFadeUp"
    style={{ animationDelay: `${delay}s`, ...(fill ? { height: '100%' } : null), ...style }}
  >
    {children}
  </div>
);
```

### Body (title-top, centred content)

The page root must be `display: flex; flexDirection: column`. Put the Eyebrow + Title first (pinned top), then wrap the rest in `Body` so it centres vertically in the remaining space.

```tsx
const Body = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      flex: 1,
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      paddingBottom: 56,
    }}
  >
    {children}
  </div>
);
```

### Footer

Do **not** add a footer. No page numbers, no footer logos, no “Confidential” / “Strictly Confidential” line.

### Steel square bullet

```tsx
const SquareBullet = ({ children }: { children: React.ReactNode }) => (
  <li
    style={{
      display: 'flex',
      gap: 16,
      alignItems: 'flex-start',
      fontSize: 34,
      lineHeight: 1.45,
      color: '#26251E',
      marginBottom: 20,
      listStyle: 'none',
    }}
  >
    <span
      style={{
        width: 10,
        height: 10,
        marginTop: 14,
        flexShrink: 0,
        background: '#3D4454',
      }}
    />
    <span>{children}</span>
  </li>
);
```

### Stat card

```tsx
const StatCard = ({
  number,
  label,
  description,
}: {
  number: string;
  label: string;
  description?: string;
}) => (
  <div
    style={{
      background: '#F7F7F4',
      border: '1px solid #E3E2DD',
      borderRadius: 4,
      padding: '24px 28px',
      minWidth: 380,
    }}
  >
    <div
      style={{
        fontSize: 80,
        fontWeight: 700,
        color: '#3D4454',
        lineHeight: 1,
        marginBottom: 8,
      }}
    >
      {number}
    </div>
    <div
      style={{
        fontSize: 28,
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: '#26251E',
        marginBottom: 8,
      }}
    >
      {label}
    </div>
    {description && (
      <div style={{ fontSize: 26, color: '#868580', lineHeight: 1.4 }}>{description}</div>
    )}
  </div>
);
```

### Tile (white card with shadow + equal height)

The default card on content slides. Renders as an explicit instance per item (never `array.map`). In a grid, every `Tile` ends up the same height (`height: '100%'` + grid `gridAutoRows: '1fr'`).

```tsx
const Tile = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div
    style={{
      background: '#FFFFFF',
      border: '1px solid #E3E2DD',
      borderRadius: 4,
      boxShadow: '0 2px 4px rgba(20,18,11,0.05), 0 6px 16px rgba(20,18,11,0.07)',
      padding: '18px 22px',
      height: '100%',
      boxSizing: 'border-box',
    }}
  >
    <div style={{ width: 56, height: 6, background: '#3D4454', marginBottom: 10 }} />
    <div
      style={{
        fontSize: 20,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#9B9A92',
        marginBottom: 10,
      }}
    >
      {title}
    </div>
    {children}
  </div>
);
```

## Motion

- Philosophy: **subtle** — staggered fade-up entrances only; no looping or rich keyframes. Matches the brand voice: fast, pro, no hype.
- Every page: fade the **title block in first** (`delay 0`), then stagger body items by ~0.06–0.08 s each (tiles in reading order). Honour `prefers-reduced-motion`.
- Paste-ready keyframes (use with the `FadeUp` component above):

```css
@keyframes brandFadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
.brandFadeUp { opacity: 0; animation: brandFadeUp 0.6s cubic-bezier(.2,.7,.2,1) both; }
@media (prefers-reduced-motion: reduce) { .brandFadeUp { animation: none; opacity: 1; } }
```

## Aesthetic

Engineered, quiet, and aerospace — Cursor Simple's content layout with SpaceXAI's black / white / steel, and a cover that follows the SpaceX title plate: white hero, `#999999` subtitle, white wordmark bottom-right, no footer. Off-white `#F7F7F4` fields with near-black `#26251E` type; steel `#3D4454` only for square bullets, stat callouts, and thin tile accent bars. White tiles with a soft shadow, the SpaceXAI symbol fixed in the top-right corner of every content/closer slide, and a quiet staggered fade-up on entrance. Sentence case everywhere except ALL CAPS section labels. No page numbers, no confidential lines, no gradients on content chrome, no round bullets, no Title Case, no dark backgrounds on content slides, no Cursor orange. Dark `#020202` reserved for the closing slide only.

## Slide patterns

Use these layouts when authoring decks with this theme. **Every page**: page root is `display: flex; flexDirection: column`; `SpaceXAILogo` top-right on content/closer only; Eyebrow + Title pinned at the top; body wrapped in `Body` (centred); entrance staggered with `FadeUp`. **Never** add a `Footer`.

1. **Title slide (required)** — every deck opens with the `Cover` component above: full-bleed `spacexai_background.png`, white `HeroTitle` + `#999999` subtitle **top-left**, `CoverWordmark` **bottom-right**. No corner symbol, no page number, no confidential line.
2. **Standard content** — Eyebrow + Title, then `SquareBullet` list or body paragraph inside `Body`.
3. **Tile grid** — 2 or 3 equal-width columns of `Tile`s (`gridAutoRows: '1fr'`, each wrapped in `FadeUp fill` with increasing `delay`). Equal height, smallest that fits.
4. **Stat callout** — left visual or copy, right stacked `StatCard` components.
5. **Closing (dark)** — `bg-dark`, "Thank you" with `HeroTitle`, `SpaceXAILogo onDark`. No footer.

## Example usage

```tsx
const Content: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: '#F7F7F4',
      color: '#26251E',
      padding: 110,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif',
    }}
  >
    <SpaceXAILogo />
    <FadeUp>
      <Eyebrow>Data flow</Eyebrow>
      <Title>Code stays local until you make a request</Title>
    </FadeUp>
    <Body>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoRows: '1fr', gap: 16 }}>
        <FadeUp delay={0.1} fill>
          <Tile title="Indexing">
            <p style={{ margin: 0, fontSize: 26, lineHeight: 1.4, color: '#3E3D36' }}>
              One-way embeddings · raw code never stored
            </p>
          </Tile>
        </FadeUp>
        <FadeUp delay={0.18} fill>
          <Tile title="LLM requests">
            <p style={{ margin: 0, fontSize: 26, lineHeight: 1.4, color: '#3E3D36' }}>
              Privacy Mode + contractual ZDR with every provider
            </p>
          </Tile>
        </FadeUp>
      </div>
    </Body>
  </div>
);
```

## Voice and tone

- Sentence case for headings; ALL CAPS only for section labels.
- Simple, direct, concise — no hype.
- Smart quotes and spaced em dashes ( — ).
- Prefer bold + italic over colour for inline emphasis.
