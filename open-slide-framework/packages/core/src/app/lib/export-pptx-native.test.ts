import { strFromU8, unzipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import {
  buildNativePptx,
  googleSlidesFontFace,
  googleSlidesTextBounds,
  inferTextAlign,
  inferTextValign,
  type NativeSlideScene,
  parseCssColor,
  relativeBounds,
  requiresAtomicRaster,
  resolveNativePptxFilename,
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

    const clipped = {
      left: 50,
      top: 150,
      right: 250,
      bottom: 450,
      width: 200,
      height: 300,
    } as DOMRect;
    expect(relativeBounds(clipped, frame)).toEqual({ x: -50, y: -50, w: 200, h: 300 });
  });

  it('uses Google Slides-safe fonts and a simple filename', () => {
    expect(googleSlidesFontFace('Roboto')).toBe('Roboto');
    expect(googleSlidesFontFace('"Open Sans"')).toBe('Open Sans');
    expect(googleSlidesFontFace('Geist')).toBe('Arial');
    expect(resolveNativePptxFilename('quarterly-review')).toBe('quarterly-review.pptx');
  });

  it('gives Google Slides text room for font metric differences', () => {
    const frame = {
      left: 0,
      top: 0,
      right: 1920,
      bottom: 1080,
      width: 1920,
      height: 1080,
    } as DOMRect;
    const titleContainer = {
      left: 110,
      top: 100,
      right: 1810,
      bottom: 180,
      width: 1700,
      height: 80,
    } as DOMRect;
    const titleText = {
      left: 110,
      top: 100,
      right: 700,
      bottom: 172,
      width: 590,
      height: 72,
    } as DOMRect;
    expect(googleSlidesTextBounds(titleText, titleContainer, frame, 'left', 64)).toEqual({
      x: 110,
      y: 100,
      w: 1700,
      h: 86.4,
    });

    const centeredLabel = {
      left: 300,
      top: 250,
      right: 370,
      bottom: 274,
      width: 70,
      height: 24,
    } as DOMRect;
    expect(googleSlidesTextBounds(centeredLabel, centeredLabel, frame, 'center', 20)).toEqual({
      x: 293,
      y: 250,
      w: 84,
      h: 27,
    });
  });

  it('infers text centering from flex and rendered geometry', () => {
    const centeredRow = {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'start',
    } as CSSStyleDeclaration;
    expect(inferTextAlign(centeredRow)).toBe('center');
    expect(
      inferTextValign(
        { top: 120, bottom: 150 },
        { top: 100, bottom: 170, height: 70 },
        centeredRow,
      ),
    ).toBe('middle');

    const centeredBlock = {
      display: 'block',
      flexDirection: 'row',
      justifyContent: 'normal',
      alignItems: 'normal',
      textAlign: 'center',
    } as CSSStyleDeclaration;
    expect(inferTextAlign(centeredBlock)).toBe('center');
    expect(
      inferTextValign(
        { top: 120, bottom: 150 },
        { top: 100, bottom: 170, height: 70 },
        centeredBlock,
      ),
    ).toBe('middle');

    const leftAlignedCenteredRow = {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'left',
    } as CSSStyleDeclaration;
    expect(inferTextAlign(leftAlignedCenteredRow)).toBe('left');

    const centeredGrid = {
      display: 'grid',
      flexDirection: 'row',
      justifyContent: 'normal',
      justifyItems: 'center',
      alignItems: 'center',
      textAlign: 'start',
    } as CSSStyleDeclaration;
    expect(inferTextAlign(centeredGrid)).toBe('center');

    const balancedBlock = {
      display: 'block',
      flexDirection: 'row',
      justifyContent: 'normal',
      justifyItems: 'normal',
      alignItems: 'normal',
      textAlign: 'start',
    } as CSSStyleDeclaration;
    expect(
      inferTextAlign(
        balancedBlock,
        { left: 114, right: 200 },
        { left: 100, right: 214, width: 114 },
      ),
    ).toBe('left');

    const paddedPill = {
      display: 'inline-block',
      flexDirection: 'row',
      justifyContent: 'normal',
      justifyItems: 'normal',
      alignItems: 'normal',
      textAlign: 'start',
    } as CSSStyleDeclaration;
    expect(
      inferTextAlign(paddedPill, { left: 114, right: 200 }, { left: 100, right: 214, width: 114 }),
    ).toBe('center');
  });

  it('classifies atomic and rotated elements for raster fallback', () => {
    const baseStyle = {
      mixBlendMode: 'normal',
      backdropFilter: 'none',
      borderTopLeftRadius: '0px',
      clipPath: 'none',
      opacity: '1',
      overflow: 'visible',
      overflowX: 'visible',
      overflowY: 'visible',
      transform: 'none',
    } as CSSStyleDeclaration;
    const div = { tagName: 'DIV', children: [] } as unknown as Element;
    expect(
      requiresAtomicRaster(
        { tagName: 'DIV', children: [], dataset: { pptxRaster: '' } } as unknown as Element,
        baseStyle,
      ),
    ).toBe(true);
    expect(requiresAtomicRaster({ tagName: 'SVG' } as Element, baseStyle)).toBe(true);
    expect(requiresAtomicRaster(div, baseStyle)).toBe(false);
    expect(
      requiresAtomicRaster(div, {
        ...baseStyle,
        transform: 'matrix(0, 1, -1, 0, 0, 0)',
      }),
    ).toBe(true);
    expect(
      requiresAtomicRaster(div, {
        ...baseStyle,
        transform: 'matrix(2, 0, 0, 2, 0, 0)',
      }),
    ).toBe(true);
    expect(
      requiresAtomicRaster({ tagName: 'DIV', children: [{}] } as unknown as Element, {
        ...baseStyle,
        borderTopLeftRadius: '20px',
        overflow: 'hidden',
      }),
    ).toBe(true);
    expect(
      requiresAtomicRaster(
        {
          tagName: 'DIV',
          children: [{ tagName: 'SVG' }],
        } as unknown as Element,
        {
          ...baseStyle,
          borderTopLeftRadius: '50%',
        },
      ),
    ).toBe(true);
  });

  it('writes editable text, shapes, images, and notes into a valid PPTX package', async () => {
    const pixel =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+XyW8WQAAAABJRU5ErkJggg==';
    const scene: NativeSlideScene = {
      fallbackCount: 1,
      background: { color: 'F7F7F4', transparency: 0 },
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
    expect(slideXml).toContain('<p:bg>');
    expect(slideXml).toContain('F7F7F4');
    expect(slideXml).toContain('Editable heading');
    expect(slideXml).toContain('112233');
    expect(files['ppt/notesSlides/notesSlide1.xml']).toBeDefined();
  });

  it('keeps text editable while retaining raster fallbacks', async () => {
    const pixel =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+XyW8WQAAAABJRU5ErkJggg==';
    const scene: NativeSlideScene = {
      fallbackCount: 1,
      elements: [
        {
          kind: 'text',
          bounds: { x: 100, y: 100, w: 600, h: 100 },
          text: 'Editable in Google Slides',
          color: { color: '112233', transparency: 0 },
          fontFace: 'Geist',
          fontSize: 32,
          bold: false,
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

    const blob = await buildNativePptx([scene], 'Google Slides export');
    const files = unzipSync(new Uint8Array(await blob.arrayBuffer()));
    const slideXml = strFromU8(files['ppt/slides/slide1.xml']);

    expect(slideXml).toContain('Editable in Google Slides');
    expect(slideXml).toContain('typeface="Arial"');
    expect(slideXml).not.toContain('Geist');
    expect(slideXml).toContain('<a:normAutofit');
    expect(slideXml).toContain('<p:pic>');
  });
});
