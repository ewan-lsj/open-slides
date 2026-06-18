import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';

export const design: DesignSystem = {
  palette: { bg: '#14120b', text: '#edecec', accent: '#f54e00' },
  fonts: {
    display: 'system-ui, -apple-system, sans-serif',
    body: 'system-ui, -apple-system, sans-serif',
  },
  typeScale: { hero: 180, body: 40 },
  radius: 12,
};

const muted = 'rgba(237, 236, 236, 0.6)';

const fill = {
  width: '100%',
  height: '100%',
  fontFamily: 'var(--osd-font-body)',
} as const;

const Cover: Page = () => (
  <div
    style={{
      ...fill,
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 160px',
    }}
  >
    <div style={{ fontSize: 28, color: 'var(--osd-accent)', letterSpacing: '0.2em' }}>
      ENVIRONMENT CHECK
    </div>
    <h1
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 'var(--osd-size-hero)',
        fontWeight: 900,
        margin: '32px 0',
        lineHeight: 1.05,
      }}
    >
      Hello, Cloud
    </h1>
    <p style={{ fontSize: 'var(--osd-size-body)', color: muted, maxWidth: 1200 }}>
      The open-slide dev server is running and rendering this freshly authored slide.
    </p>
  </div>
);

const Status: Page = () => (
  <div
    style={{
      ...fill,
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      padding: 120,
    }}
  >
    <h2
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 80,
        fontWeight: 800,
        margin: 0,
      }}
    >
      Setup verified
    </h2>
    <ul style={{ fontSize: 'var(--osd-size-body)', lineHeight: 1.6, marginTop: 64, paddingLeft: 48 }}>
      <li>Dependencies installed with npm</li>
      <li>Production build succeeds</li>
      <li>Dev server serves at localhost:5173</li>
      <li>Hot reload renders new slides</li>
    </ul>
  </div>
);

export const meta: SlideMeta = {
  title: 'Hello, Cloud',
  createdAt: '2026-06-18T14:51:11.270Z',
};
export default [Cover, Status] satisfies Page[];
