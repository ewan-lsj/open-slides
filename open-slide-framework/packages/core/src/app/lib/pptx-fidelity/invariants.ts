import {
  flattenTextElement,
  NATIVE_SCENE_H,
  NATIVE_SCENE_W,
  type NativeSceneElement,
  type NativeSlideScene,
  type SceneFidelityReport,
} from '../export-native-scene';

export type IrInvariantViolation = {
  code: string;
  message: string;
  elementIndex?: number;
};

export function assertSceneInvariants(scene: NativeSlideScene): IrInvariantViolation[] {
  const violations: IrInvariantViolation[] = [];
  const textOrigins = new Map<string, number>();

  scene.elements.forEach((element, index) => {
    if (element.bounds.w <= 0 || element.bounds.h <= 0) {
      violations.push({
        code: 'zero-area',
        message: `element ${index} has zero area`,
        elementIndex: index,
      });
    }
    if (
      element.bounds.x < -1 ||
      element.bounds.y < -1 ||
      element.bounds.x + element.bounds.w > NATIVE_SCENE_W + 1 ||
      element.bounds.y + element.bounds.h > NATIVE_SCENE_H + 1
    ) {
      violations.push({
        code: 'out-of-bounds',
        message: `element ${index} exceeds canvas`,
        elementIndex: index,
      });
    }
    if (element.kind === 'shape') {
      const invisibleFill = !element.fill || element.fill.transparency >= 100;
      const invisibleLine = !element.line || element.line.transparency >= 100;
      if (
        invisibleFill &&
        invisibleLine &&
        !element.gradient &&
        !element.shadow &&
        !element.borders
      ) {
        violations.push({
          code: 'invisible-shape',
          message: `shape ${index} has no visible fill or line`,
          elementIndex: index,
        });
      }
    }
    if (element.kind === 'text') {
      const key = `${Math.round(element.bounds.x)}:${Math.round(element.bounds.y)}`;
      const previous = textOrigins.get(key);
      if (previous !== undefined) {
        violations.push({
          code: 'coincident-text',
          message: `text ${index} shares origin with text ${previous}`,
          elementIndex: index,
        });
      } else {
        textOrigins.set(key, index);
      }
      const flat = flattenTextElement(element);
      if (!flat.text.trim()) {
        violations.push({
          code: 'empty-text',
          message: `text ${index} is empty`,
          elementIndex: index,
        });
      }
    }
  });

  return violations;
}

export function summarizeScenes(scenes: NativeSlideScene[]): SceneFidelityReport {
  const report: SceneFidelityReport = {
    nativeCount: 0,
    rasterCount: 0,
    textCount: 0,
    shapeCount: 0,
    imageCount: 0,
    rasterReasons: {},
  };
  for (const scene of scenes) {
    const current = scene.report;
    if (!current) continue;
    report.nativeCount += current.nativeCount;
    report.rasterCount += current.rasterCount;
    report.textCount += current.textCount;
    report.shapeCount += current.shapeCount;
    report.imageCount += current.imageCount;
    for (const [reason, count] of Object.entries(current.rasterReasons)) {
      report.rasterReasons[reason] = (report.rasterReasons[reason] ?? 0) + count;
    }
  }
  return report;
}

export function formatFidelityReport(report: SceneFidelityReport): string {
  const reasons = Object.entries(report.rasterReasons)
    .map(([reason, count]) => `${reason}:${count}`)
    .join(', ');
  return `native ${report.nativeCount} · raster ${report.rasterCount} · text ${report.textCount}${
    reasons ? ` · ${reasons}` : ''
  }`;
}

export function sceneTextContent(scene: NativeSlideScene): string {
  return scene.elements
    .filter(
      (element): element is Extract<NativeSceneElement, { kind: 'text' }> =>
        element.kind === 'text',
    )
    .map((element) => flattenTextElement(element).text)
    .join('\n');
}

export function promoteMeasuredWrap(
  scene: NativeSlideScene,
  elementIndexes: number[],
): NativeSlideScene {
  const indexes = new Set(elementIndexes);
  return {
    ...scene,
    elements: scene.elements.map((element, index) => {
      if (!indexes.has(index) || element.kind !== 'text') return element;
      return { ...element, wrapMode: 'measured' as const };
    }),
  };
}
