import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import mark from './assets/mark.svg';

export const design: DesignSystem = {
  palette: { bg: '#f7f5ef', text: '#161616', accent: '#5b44ff' },
  fonts: {
    display: 'Arial, sans-serif',
    body: 'Arial, sans-serif',
  },
  typeScale: { hero: 112, body: 38 },
  radius: 24,
};

const EditableExport: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      padding: 120,
      boxSizing: 'border-box',
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      fontFamily: 'var(--osd-font-body)',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
      <img src={mark} alt="Open slide mark" style={{ width: 92, height: 92 }} />
      <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--osd-accent)' }}>
        EDITABLE PPTX
      </div>
    </div>
    <h1
      style={{
        margin: '58px 0 28px',
        maxWidth: 1400,
        fontFamily: 'var(--osd-font-display)',
        fontSize: 'var(--osd-size-hero)',
        lineHeight: 1.02,
        letterSpacing: '-0.045em',
      }}
    >
      Native where it matters.
    </h1>
    <p style={{ margin: 0, maxWidth: 1250, fontSize: 38, lineHeight: 1.45 }}>
      Text, images, fills, and borders stay editable. Complex effects remain visually faithful.
    </p>
    <div style={{ display: 'flex', gap: 32, marginTop: 72 }}>
      <div
        style={{
          width: 510,
          padding: 36,
          border: '3px solid #161616',
          borderRadius: 24,
          background: '#ffffff',
          fontSize: 32,
          fontWeight: 700,
        }}
      >
        Native text + shape
      </div>
      <div
        style={{
          width: 510,
          padding: 36,
          borderRadius: 24,
          background: 'linear-gradient(135deg, #5b44ff, #ff5c8a)',
          color: '#ffffff',
          fontSize: 32,
          fontWeight: 700,
        }}
      >
        Raster fallback region
      </div>
    </div>
  </div>
);

export const notes = [
  'Upload the exported editable PPTX to Google Drive, then open it with Google Slides.',
];

export const meta: SlideMeta = {
  title: 'Editable PPTX export',
  createdAt: '2026-07-01T07:47:20.074Z',
};

export default [EditableExport] satisfies Page[];
