import { strFromU8, unzipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import {
  applyTextTransform,
  googleSlidesFontFace,
  googleSlidesTextBounds,
  inferTextAlign,
  inferTextValign,
  type NativeSlideScene,
  paddingInsetsFromStyle,
  parseBoxShadow,
  parseCssColor,
  parseGradient,
  relativeBounds,
  requiresAtomicRaster,
} from './export-native-scene';
import { resolveNativePptxFilename } from './export-pptx-native';
import { buildNativePptx, pxToEmu, validatePptxPackage } from './export-pptx-writer';

describe('editable PPTX export', () => {
  it('parses CSS colors and alpha values', () => {
    expect(parseCssColor('#0f8')).toEqual({ color: '00FF88', transparency: 0 });
    expect(parseCssColor('rgba(255, 0, 128, 0.25)')).toEqual({
      color: 'FF0080',
      transparency: 75,
    });
    expect(parseCssColor('transparent')).toBeUndefined();
    expect(parseCssColor('rgba(0, 0, 0, 0)')).toBeUndefined();
  });

  it('applies text-transform in JS', () => {
    expect(applyTextTransform('Challenge', 'uppercase')).toBe('CHALLENGE');
    expect(applyTextTransform('Hello World', 'lowercase')).toBe('hello world');
    expect(applyTextTransform('hello world', 'capitalize')).toBe('Hello World');
  });

  it('parses gradients and box shadows', () => {
    expect(parseGradient('linear-gradient(90deg, #112233 0%, #445566 100%)')).toEqual({
      kind: 'linear',
      angle: 90,
      stops: [
        { offset: 0, color: { color: '112233', transparency: 0 } },
        { offset: 1, color: { color: '445566', transparency: 0 } },
      ],
    });
    expect(parseBoxShadow('0 4px 12px rgba(0,0,0,0.25)')).toMatchObject({
      offsetX: 0,
      offsetY: 4,
      blur: 12,
      inset: false,
      color: { color: '000000', transparency: 75 },
    });
    // Chromium computed style: color-first, with trailing spread.
    expect(parseBoxShadow('rgba(20, 18, 11, 0.05) 0px 2px 4px 0px')).toMatchObject({
      offsetX: 0,
      offsetY: 2,
      blur: 4,
      spread: 0,
      color: { color: '14120B', transparency: 95 },
    });
    // Multi-layer card shadow: pick the more visible (larger blur) outer layer.
    expect(
      parseBoxShadow(
        'rgba(20, 18, 11, 0.05) 0px 2px 4px 0px, rgba(20, 18, 11, 0.07) 0px 6px 16px 0px',
      ),
    ).toMatchObject({
      offsetX: 0,
      offsetY: 6,
      blur: 16,
      color: { color: '14120B', transparency: 93 },
    });
    // Unit suffixes must never be treated as named colors.
    expect(parseBoxShadow('rgba(0, 0, 0, 0.25) 0px 4px 12px 0px')).toMatchObject({
      offsetX: 0,
      offsetY: 4,
      blur: 12,
      color: { transparency: 75 },
    });
  });

  it('maps CSS padding on a text block to OOXML body insets', () => {
    expect(
      paddingInsetsFromStyle({
        paddingLeft: '28px',
        paddingTop: '20px',
        paddingRight: '28px',
        paddingBottom: '20px',
      } as CSSStyleDeclaration),
    ).toEqual({ left: 28, top: 20, right: 28, bottom: 20 });
    expect(
      paddingInsetsFromStyle({
        paddingLeft: '0px',
        paddingTop: '0px',
        paddingRight: '0px',
        paddingBottom: '0px',
      } as CSSStyleDeclaration),
    ).toBeUndefined();
  });

  it('converts measured DOM bounds to canvas-relative coordinates', () => {
    const rect = { left: 125, top: 250, width: 400, height: 300 } as DOMRect;
    const frame = { left: 100, top: 200 } as DOMRect;
    expect(relativeBounds(rect, frame)).toEqual({ x: 25, y: 50, w: 400, h: 300 });
    expect(pxToEmu(1920)).toBe(12192000);
    expect(pxToEmu(1080)).toBe(6858000);
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
    expect(requiresAtomicRaster(div, baseStyle)).toBe(false);
  });

  it('writes editable multi-run text, shapes, images, and notes into a valid PPTX package', async () => {
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
          paragraphs: [
            {
              runs: [
                {
                  text: 'Dual agentic: ',
                  color: { color: 'FFFFFF', transparency: 0 },
                  fontFace: 'Inter',
                  fontSize: 24,
                  bold: true,
                  italic: false,
                },
                {
                  text: 'Vertex platform',
                  color: { color: 'FFFFFF', transparency: 0 },
                  fontFace: 'Inter',
                  fontSize: 24,
                  bold: false,
                  italic: false,
                  charSpacing: 1.2,
                },
              ],
              align: 'left',
              lineSpacing: 32,
            },
          ],
          valign: 'top',
          wrapMode: 'reflow',
        },
        {
          kind: 'raster',
          bounds: { x: 800, y: 200, w: 200, h: 200 },
          data: pixel,
          reason: 'decoration',
        },
      ],
    };

    const blob = await buildNativePptx([scene], 'Native export');
    const files = unzipSync(new Uint8Array(await blob.arrayBuffer()));
    const slideXml = strFromU8(files['ppt/slides/slide1.xml']);

    expect(validatePptxPackage(files)).toEqual([]);
    expect(files['[Content_Types].xml']).toBeDefined();
    expect(slideXml).toContain('<p:bg>');
    expect(slideXml).toContain('F7F7F4');
    expect(slideXml).toContain('Dual agentic: ');
    expect(slideXml).toContain('Vertex platform');
    expect(slideXml).toContain('b="1"');
    expect(slideXml).toContain('typeface="Inter"');
    expect(slideXml).toContain('spc="120"');
    expect(slideXml).toContain('112233');
    expect(slideXml).toContain(`cx="${pxToEmu(1920)}"`);
    expect(files['ppt/notesSlides/notesSlide1.xml']).toBeDefined();
  });

  it('keeps text editable while retaining raster fallbacks and real fonts', async () => {
    const pixel =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+XyW8WQAAAABJRU5ErkJggg==';
    const scene: NativeSlideScene = {
      fallbackCount: 1,
      elements: [
        {
          kind: 'text',
          bounds: { x: 100, y: 100, w: 600, h: 100 },
          paragraphs: [
            {
              runs: [
                {
                  text: 'Editable in PowerPoint',
                  color: { color: '112233', transparency: 0 },
                  fontFace: 'Geist',
                  fontSize: 32,
                  bold: false,
                  italic: false,
                },
              ],
              align: 'left',
            },
          ],
          valign: 'top',
          wrapMode: 'reflow',
        },
        {
          kind: 'raster',
          bounds: { x: 800, y: 200, w: 200, h: 200 },
          data: pixel,
        },
      ],
    };

    const blob = await buildNativePptx([scene], 'PowerPoint export');
    const files = unzipSync(new Uint8Array(await blob.arrayBuffer()));
    const slideXml = strFromU8(files['ppt/slides/slide1.xml']);

    expect(slideXml).toContain('Editable in PowerPoint');
    expect(slideXml).toContain('typeface="Geist"');
    expect(slideXml).toContain('<p:pic>');
    expect(validatePptxPackage(files)).toEqual([]);
  });

  it('dedupes identical media across slides', async () => {
    const pixel =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+XyW8WQAAAABJRU5ErkJggg==';
    const makeScene = (): NativeSlideScene => ({
      fallbackCount: 1,
      elements: [{ kind: 'raster', bounds: { x: 0, y: 0, w: 10, h: 10 }, data: pixel }],
    });
    const blob = await buildNativePptx([makeScene(), makeScene()], 'Dedupe');
    const files = unzipSync(new Uint8Array(await blob.arrayBuffer()));
    const media = Object.keys(files).filter((path) => path.startsWith('ppt/media/'));
    expect(media).toHaveLength(1);
  });
});
