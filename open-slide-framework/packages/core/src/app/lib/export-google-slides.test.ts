import { describe, expect, it } from 'vitest';
import {
  buildGoogleSlidesRequests,
  buildImageInsertRequests,
  buildSpeakerNotesRequests,
  elementObjectId,
  googleSlidesEditUrl,
  pageScale,
  parseDataUri,
  slideObjectId,
} from './export-google-slides';
import type { NativeSlideScene } from './export-native-scene';
import { googleSlidesFontFace } from './export-native-scene';

const PAGE_SIZE = {
  width: { magnitude: 9144000, unit: 'EMU' },
  height: { magnitude: 5143500, unit: 'EMU' },
};

describe('Google Slides export', () => {
  it('builds edit URLs', () => {
    expect(googleSlidesEditUrl('abc123')).toBe(
      'https://docs.google.com/presentation/d/abc123/edit',
    );
  });

  it('parses data URIs', () => {
    const pixel =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+XyW8WQAAAABJRU5ErkJggg==';
    const parsed = parseDataUri(pixel);
    expect(parsed.mimeType).toBe('image/png');
    expect(parsed.bytes.length).toBeGreaterThan(0);
  });

  it('computes page scale from presentation page size', () => {
    const scale = pageScale(PAGE_SIZE);
    expect(scale.x).toBeCloseTo(9144000 / 1920);
    expect(scale.y).toBeCloseTo(5143500 / 1080);
    expect(scale.font).toBeCloseTo(0.75);
  });

  it('builds native slide requests with Google-safe fonts and raster images', () => {
    const pixel =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+XyW8WQAAAABJRU5ErkJggg==';
    const scene: NativeSlideScene = {
      fallbackCount: 1,
      background: { color: 'F7F7F4', transparency: 0 },
      notes: 'Speaker note',
      elements: [
        {
          kind: 'text',
          bounds: { x: 100, y: 100, w: 600, h: 100 },
          paragraphs: [
            {
              runs: [
                {
                  text: 'Editable in Google Slides',
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

    const slideIds = [slideObjectId(0)];
    const imageUrls = new Map([[pixel, 'https://drive.google.com/uc?export=download&id=file123']]);
    const requests = buildGoogleSlidesRequests([scene], slideIds, PAGE_SIZE, imageUrls);

    expect(requests[0]).toMatchObject({
      updatePageProperties: {
        objectId: slideObjectId(0),
      },
    });
    expect(
      requests.some(
        (request) => (request.createShape as { shapeType?: string })?.shapeType === 'TEXT_BOX',
      ),
    ).toBe(true);
    expect(
      requests.some(
        (request) =>
          (request.updateTextStyle as { style?: { fontFamily?: string } })?.style?.fontFamily ===
          googleSlidesFontFace('Geist'),
      ),
    ).toBe(true);
    expect(
      requests.some(
        (request) =>
          (request.updateTextStyle as { style?: { fontSize?: { magnitude?: number } } })?.style
            ?.fontSize?.magnitude === 24,
      ),
    ).toBe(true);
    expect(
      requests.some((request) =>
        String((request.createImage as { url?: string })?.url ?? '').includes('file123'),
      ),
    ).toBe(true);
    expect(
      requests.some(
        (request) =>
          (request.insertText as { text?: string })?.text === 'Editable in Google Slides',
      ),
    ).toBe(true);
    expect(elementObjectId(0, 0)).toMatch(/^os_el_000_/);
  });

  it('builds speaker notes requests', () => {
    const scenes: NativeSlideScene[] = [
      { elements: [], fallbackCount: 0, notes: 'First note' },
      { elements: [], fallbackCount: 0 },
    ];
    const requests = buildSpeakerNotesRequests(scenes, ['notes_shape_1', 'notes_shape_2']);
    expect(requests).toEqual([
      {
        insertText: {
          objectId: 'notes_shape_1',
          insertionIndex: 0,
          text: 'First note',
        },
      },
    ]);
  });

  it('uses the Slides API field for image z-order updates', () => {
    expect(
      buildImageInsertRequests({
        createImage: {
          objectId: 'image_1',
          url: 'https://example.com/image.png',
        },
      }),
    ).toEqual([
      {
        createImage: {
          objectId: 'image_1',
          url: 'https://example.com/image.png',
        },
      },
      {
        updatePageElementsZOrder: {
          pageElementObjectIds: ['image_1'],
          operation: 'SEND_TO_BACK',
        },
      },
    ]);
  });
});
