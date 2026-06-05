---
name: Cursor Brand Simple
description: Warm neutral light slides with restrained orange accents; dark cover and closer only. Derived from Cursor "Simple" PPTX brand guidelines.
mode: light
---

# Cursor Brand Simple

## Palette

| Role          | Value     | Notes                                              |
| ------------- | --------- | -------------------------------------------------- |
| bg            | `#F7F7F4` | Main content slide background (warm off-white)     |
| text          | `#26251E` | Primary headings and body                          |
| accent        | `#F54E00` | Orange — bullets, stat numbers, card accent bars |
| muted         | `#9B9A92` | Section labels, captions, footer confidential      |
| text-secondary| `#5C5B54` | Supporting body copy                               |
| text-body     | `#3E3D36` | Body inside cards                                  |
| text-subtitle | `#6B6A62` | Taglines inside cards                              |
| accent-alt    | `#E85C2B` | Badges, secondary orange                           |
| tile-fill     | `#FFFFFF` | Tile/card fill — white, lifts off the `#F7F7F4` field |
| tile-shadow   | `0 2px 4px rgba(20,18,11,0.05), 0 6px 16px rgba(20,18,11,0.07)` | Soft tile elevation |
| card          | `#F7F7F4` | Legacy flat card fill (same as bg)                 |
| card-border   | `#E3E2DD` | Card / tile stroke                                 |
| card-01       | `#F0EFEB` | Nested card level 1                                |
| divider       | `#D9D9D9` | Horizontal rules                                   |
| heading-dark  | `#1A1A1A` | Alternate near-black headings                      |
| bg-dark       | `#14120B` | Title and closing slides only                      |
| text-dark     | `#EDECEC` | Primary text on dark slides                        |
| text-dark-muted | `#969592` | Subtitles and dates on dark slides               |
| stat-muted    | `#868580` | Stat card descriptions                             |

## Typography

- Display font: `"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif` — bold for headings.
- Body font: same stack — regular 400–500 for body.
- Numeric tables (optional): `"Calibri", "Helvetica Neue", sans-serif` for tighter numerals.
- Type-scale overrides (1920 × 1080 canvas; scaled from PPTX pt guide):
  - Section label (Eyebrow): 22 px, bold, ALL CAPS
  - Page title (content): 64 px, bold, sentence case
  - Hero title (dark cover): 96 px, bold
  - Hero subtitle (dark cover): 72 px, regular
  - Body text: 34 px, regular
  - Body secondary: 30 px, regular
  - Card heading: 32 px, bold
  - Card body: 28 px, regular
  - Stat number: 80 px, bold, accent color
  - Stat label: 28 px, bold, ALL CAPS
  - Footer: 22 px, regular

## Layout

- Canvas 1920 × 1080. Content padding: **110 px** from canvas edges (maps ~0.57" at 1920 width).
- **Logo in the corner (content + closer slides):** the Cursor mark is pinned `position: absolute; top: 48; right: 48; height: 44` — identical position and size on every content and closer page. Use the **light mark on dark slides** and the **dark mark on light slides** (see `CursorLogo` below). Never omit it or move it. The title slide is the one exception (see below).
- **Page composition (content slides):** the page root is a flex column. The title block (Eyebrow → Title) is pinned at the **top**; the body is **vertically centred** in the remaining space via the `Body` wrapper; the Footer (page number) is absolute at the bottom. Title at top, content centred — hold this on every content slide.
- **Title slide (required — every deck opens with this):** a full-bleed `title_slide.svg` background (`<img>` pinned `inset: 0; width/height: 100%; objectFit: cover; zIndex: 0`) with the **horizontal lockup** `LOCKUP_HORIZONTAL_2D_DARK.svg` pinned **top-left** (`top: 48; left: 110; height: 124`) — sized so its baseline meets the title text below; not the corner cube. The title block is **top-anchored** (`justifyContent: 'flex-start'`) and **left-aligned to the lockup** (shares the 110 px root padding), sitting just below it (`marginTop` ≈ 80). `HeroTitle` + subtitle render in **white** (`#FFFFFF`) for contrast over the image. See `TitleLockup` and `Cover` below.
- **Closer (dark):** `bg-dark` background, content **centred** (`justifyContent: 'center'`) — a `HeroTitle` (e.g. "Thank you"), with the corner mark top-right in the light mark.
- **Tiles (cards):** white fill `#FFFFFF` with the soft `tile-shadow` so they lift off the field; 1 px `#E3E2DD` border; 4–6 px orange accent bar at the top. In a grid, make **every tile equal height** with `gridAutoRows: '1fr'` + tile `height: '100%'`, and size them to the **smallest** that fits the tallest tile's content. **Never** stretch a tile grid to fill the page with `flex: 1` — that creates oversized boxes with whitespace. Let the centred `Body` balance the leftover space instead.
- Alignment: left-aligned content; 16–24 px gaps between tiles; generous vertical spacing between blocks.
- Footer zone: absolute bottom band, 110 px side padding, ~48–56 px from bottom.
- **Dark slides** (`bg-dark`) for cover and closer only — never for body content.
- Orange accent: sparingly — bullets, one stat, one accent bar per tile.

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

`color` defaults to `#EDECEC` (the dark closer). Pass `color="#FFFFFF"` on the title slide so it reads cleanly over the `title_slide.svg` image.

```tsx
const HeroTitle = ({
  children,
  color = '#EDECEC',
}: {
  children: React.ReactNode;
  color?: string;
}) => (
  <h1
    style={{
      fontSize: 96,
      fontWeight: 700,
      lineHeight: 1.1,
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

### Title lockup (title slide only)

The full horizontal Cursor lockup, pinned top-left on the title slide. `LOCKUP_HORIZONTAL_2D_DARK.svg` is the light-fill lockup for dark/image backgrounds. The title slide uses this **instead of** the corner `CursorLogo`.

```tsx
import lockupDark from '@assets/LOCKUP_HORIZONTAL_2D_DARK.svg';

const TitleLockup = () => (
  <img
    src={lockupDark}
    alt="Cursor"
    style={{ position: 'absolute', top: 48, left: 110, height: 124, width: 'auto', zIndex: 1 }}
  />
);
```

### Cover (title slide — required)

Every deck's first slide is this exact treatment: full-bleed `title_slide.svg` behind the `TitleLockup` (top-left) and a white `HeroTitle` + subtitle, top-anchored and left-aligned to the lockup. Copy verbatim and only change the title/subtitle copy.

```tsx
import titleSlideBg from '@assets/title_slide.svg';

const Cover: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: '#14120B',
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
    <TitleLockup />
    <div className="brandFadeUp" style={{ position: 'relative', zIndex: 1, marginTop: 80 }}>
      <HeroTitle color="#FFFFFF">Overview of security controls</HeroTitle>
      <p style={{ margin: '24px 0 0', fontSize: 48, fontWeight: 500, lineHeight: 1.2, color: '#FFFFFF' }}>
        ISS / Cursor
      </p>
    </div>
    <Footer partnerName="Cursor" dark />
  </div>
);
```

### Cursor logo (corner — every slide)

`cursor_dark.svg` is the **light** mark (`#edecec`, for dark slides); `cursor_light.svg` is the **dark** mark (`#26251e`, for light slides). Pass `onDark` on the cover/closer.

```tsx
import cursorLight from '@assets/cursor_light.svg';
import cursorDark from '@assets/cursor_dark.svg';

const CursorLogo = ({ onDark = false }: { onDark?: boolean }) => (
  <img
    src={onDark ? cursorDark : cursorLight}
    alt="Cursor"
    style={{ position: 'absolute', top: 48, right: 48, height: 44, width: 'auto' }}
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

Pull the page number from `useSlidePageNumber()` — never hardcode `pageNum` / `total` props.

```tsx
import { useSlidePageNumber } from '@open-slide/core';

const Footer = ({
  partnerName = 'Cursor',
  confidential = false,
  dark = false,
}: {
  partnerName?: string;
  confidential?: boolean;
  dark?: boolean;
}) => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left: 110,
        right: 110,
        bottom: 56,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        fontSize: 22,
        color: dark ? '#969592' : '#9B9A92',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif',
      }}
    >
      <span style={{ color: dark ? '#EDECEC' : '#26251E' }}>{partnerName}</span>
      <span style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
        {confidential && (
          <span>Confidential — prepared for {partnerName}</span>
        )}
        <span>
          {current} / {total}
        </span>
      </span>
    </div>
  );
};
```

### Orange square bullet

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
        background: '#F54E00',
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
        color: '#F54E00',
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
    <div style={{ width: 56, height: 6, background: '#F54E00', marginBottom: 10 }} />
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
- Every page: fade the **title block in first** (`delay 0`), then stagger body items by ~0.06–0.08 s each (tiles in reading order, footer band last). Honour `prefers-reduced-motion`.
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

Engineered, quiet, and warm — the Cursor "Simple" deck. Off-white `#F7F7F4` fields with near-black `#26251E` type; orange `#F54E00` only for square bullets, stat callouts, and thin tile accent bars. White tiles with a soft shadow, a Cursor mark fixed in the top-right corner of every content/closer slide, and a quiet staggered fade-up on entrance. The opening title slide is the signature exception: the full-bleed `title_slide.svg` image carries the horizontal `LOCKUP_HORIZONTAL_2D_DARK.svg` lockup top-left with the white title left-aligned beneath it. Sentence case everywhere except ALL CAPS section labels. No gradients, no round bullets, no Title Case, no dark backgrounds on content slides. Dark `#14120B` reserved for the closing slide only.

## Slide patterns

Use these layouts when authoring decks with this theme. **Every page**: page root is `display: flex; flexDirection: column`; `CursorLogo` top-right (except the title slide, which uses `TitleLockup` top-left); Eyebrow + Title pinned at the top; body wrapped in `Body` (centred); `Footer` at the bottom; entrance staggered with `FadeUp`.

1. **Title slide (required)** — every deck opens with the `Cover` component above: full-bleed `title_slide.svg` background, `TitleLockup` top-left, white `HeroTitle` + subtitle **top-anchored and left-aligned to the lockup** (`justifyContent: 'flex-start'`, `marginTop` ≈ 80). No corner cube on this slide.
2. **Standard content** — Eyebrow + Title, then `SquareBullet` list or body paragraph inside `Body`.
3. **Tile grid** — 2 or 3 equal-width columns of `Tile`s (`gridAutoRows: '1fr'`, each wrapped in `FadeUp fill` with increasing `delay`). Equal height, smallest that fits. Optional full-width `Tile` beneath as a footer band.
4. **Stat callout** — left visual or copy, right stacked `StatCard` components.
5. **Closing (dark)** — `bg-dark`, "Thank you" with `HeroTitle`, `CursorLogo onDark`.

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
    <CursorLogo />
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
    <Footer partnerName="ISS × Cursor" />
  </div>
);
```

## Voice and tone

- Sentence case for headings; ALL CAPS only for section labels.
- Simple, direct, concise — no hype.
- Smart quotes and spaced em dashes ( — ).
- Prefer bold + italic over red for inline emphasis.
