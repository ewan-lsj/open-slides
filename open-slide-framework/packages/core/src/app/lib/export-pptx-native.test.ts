import { strFromU8, unzipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import {
  buildNativePptx,
  parseCssColor,
  relativeBounds,
  requiresAtomicRaster,
  type NativeSlideScene,
} from './export-pptx-native';

describe('editable PPTX export', () => {
  it('parses CSS colors and alpha values', () => {
    expect(parseCssColor('#0f8')).toEqual({ color: '00FF88', transparency: 0 });
    expect(parseCssColor('rgba(255, 0, 128, 0.25)')).toEqual({
      color: 'FF0080',
      transparency: 75,
    });
    expect(parseCssColor('transparent')).toBeUndefined();
  });

  it('converts measured DOM bounds to canvas-relative coordinates', () => {
    const rect = { left: 125, top: 250, width: 400, height: 300 } as DOMRect;
    const frame = { left: 100, top: 200 } as DOMRect;
    expect(relativeBounds(rect, frame)).toEqual({ x: 25, y: 50, w: 400, h: 300 });
  });

  it('classifies atomic and rotated elements for raster fallback', () => {
    const baseStyle = {
      mixBlendMode: 'normal',
      backdropFilter: 'none',
      transform: 'none',
    } as CSSStyleDeclaration;
    expect(requiresAtomicRaster({ tagName: 'SVG' } as Element, baseStyle)).toBe(true);
    expect(requiresAtomicRaster({ tagName: 'DIV' } as Element, baseStyle)).toBe(false);
    expect(
      requiresAtomicRaster(
        { tagName: 'DIV' } as Element,
        { ...baseStyle, transform: 'matrix(0, 1, -1, 0, 0, 0)' },
      ),
    ).toBe(true);
  });

  it('writes editable text, shapes, images, and notes into a valid PPTX package', async () => {
    const pixel =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+XyW8WQAAAABJRU5ErkJggg==';
    const scene: NativeSlideScene = {
      fallbackCount: 1,
      notes: 'Speaker note',
      elements: [
        {
          kind: 'shape',
          bounds: { x: 0, y: 0, w: 1920, h: 1080 },
          fill: { color: '112233', transparency: 0 },
          radius: 0,
        },
        {
          kind: 'text',
          bounds: { x: 100, y: 100, w: 600, h: 100 },
          text: 'Editable heading',
          color: { color: 'FFFFFF', transparency: 0 },
          fontFace: 'Arial',
          fontSize: 32,
          bold: true,
          italic: false,
          align: 'left',
          valign: 'top',
        },
        {
          kind: 'raster',
          bounds: { x: 800, y: 200, w: 200, h: 200 },
          data: pixel,
        },
      ],
    };

    const blob = await buildNativePptx([scene], 'Native export');
    const files = unzipSync(new Uint8Array(await blob.arrayBuffer()));
    const slideXml = strFromU8(files['ppt/slides/slide1.xml']);

    expect(files['[Content_Types].xml']).toBeDefined();
    expect(slideXml).toContain('Editable heading');
    expect(slideXml).toContain('112233');
    expect(files['ppt/notesSlides/notesSlide1.xml']).toBeDefined();
  });
});
