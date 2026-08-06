import { unzipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import type { NativeSlideScene } from '../export-native-scene';
import { buildNativePptx, validatePptxPackage } from '../export-pptx-writer';
import {
  assertSceneInvariants,
  formatFidelityReport,
  promoteMeasuredWrap,
  runFidelityGate,
  sceneToSvg,
} from './index';
import { summarizeScenes } from './invariants';

function textScene(): NativeSlideScene {
  return {
    fallbackCount: 0,
    background: { color: 'FFFFFF', transparency: 0 },
    elements: [
      {
        kind: 'shape',
        bounds: { x: 40, y: 40, w: 400, h: 200 },
        fill: { color: '112233', transparency: 0 },
        radius: 8,
      },
      {
        kind: 'text',
        bounds: { x: 60, y: 60, w: 360, h: 80 },
        paragraphs: [
          {
            runs: [
              {
                text: 'Hello ',
                color: { color: 'FFFFFF', transparency: 0 },
                fontFace: 'Inter',
                fontSize: 24,
                bold: false,
                italic: false,
              },
              {
                text: 'World',
                color: { color: 'FFFFFF', transparency: 0 },
                fontFace: 'Inter',
                fontSize: 24,
                bold: true,
                italic: false,
              },
            ],
            align: 'left',
          },
        ],
        valign: 'top',
        wrapMode: 'reflow',
      },
    ],
    report: {
      nativeCount: 2,
      rasterCount: 0,
      textCount: 1,
      shapeCount: 1,
      imageCount: 0,
      rasterReasons: {},
    },
  };
}

describe('pptx fidelity gate', () => {
  it('flags invisible shapes and coincident text origins', () => {
    const scene: NativeSlideScene = {
      fallbackCount: 0,
      elements: [
        {
          kind: 'shape',
          bounds: { x: 0, y: 0, w: 10, h: 10 },
          fill: { color: '000000', transparency: 100 },
          radius: 0,
        },
        {
          kind: 'text',
          bounds: { x: 10, y: 10, w: 100, h: 20 },
          paragraphs: [
            {
              runs: [
                {
                  text: 'A',
                  color: { color: '000000', transparency: 0 },
                  fontFace: 'Arial',
                  fontSize: 12,
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
          kind: 'text',
          bounds: { x: 10, y: 10, w: 100, h: 20 },
          paragraphs: [
            {
              runs: [
                {
                  text: 'B',
                  color: { color: '000000', transparency: 0 },
                  fontFace: 'Arial',
                  fontSize: 12,
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
      ],
    };
    const violations = assertSceneInvariants(scene);
    expect(violations.some((v) => v.code === 'invisible-shape')).toBe(true);
    expect(violations.some((v) => v.code === 'coincident-text')).toBe(true);
  });

  it('accepts a well-formed editable scene and builds a valid package', async () => {
    const scene = textScene();
    expect(assertSceneInvariants(scene)).toEqual([]);
    const result = await runFidelityGate([scene]);
    expect(result.invariants).toEqual([]);
    expect(result.packageErrors).toEqual([]);
    expect(result.svg[0]).toContain('<svg');
    expect(result.svg[0]).toContain('Hello ');
    expect(result.svg[0]).toContain('World');
  });

  it('promotes text blocks to measured wrap mode', () => {
    const promoted = promoteMeasuredWrap(textScene(), [1]);
    expect(promoted.elements[1]).toMatchObject({ kind: 'text', wrapMode: 'measured' });
  });

  it('formats fidelity reports and validates OOXML structure', async () => {
    const scene = textScene();
    const summary = summarizeScenes([scene]);
    expect(formatFidelityReport(summary)).toContain('native 2');
    const blob = await buildNativePptx([scene], 'gate');
    const files = unzipSync(new Uint8Array(await blob.arrayBuffer()));
    expect(validatePptxPackage(files)).toEqual([]);
    expect(sceneToSvg(scene)).toContain('font-family="Inter"');
  });
});
