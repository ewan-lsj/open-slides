import { captureNativeSlideScenes, type SceneFidelityReport } from './export-native-scene';
import type { PptxExportProgress } from './export-pptx';
import { buildNativePptx } from './export-pptx-writer';
import type { SlideModule } from './sdk';

export type { SceneFidelityReport };

export async function exportSlideAsPptx(
  slide: SlideModule,
  slideId: string,
  onProgress?: (progress: PptxExportProgress) => void,
): Promise<SceneFidelityReport[]> {
  const pages = slide.default ?? [];
  if (pages.length === 0) return [];

  const total = pages.length;
  let fallbackCount = 0;
  onProgress?.({ phase: 'processing', current: 0, total, percent: 0, fallbackCount });

  const scenes = await captureNativeSlideScenes(slide, 'powerpoint', (progress) => {
    fallbackCount = progress.fallbackCount;
    onProgress?.({
      phase: 'processing',
      current: progress.current,
      total: progress.total,
      percent: Math.min(95, (progress.current / progress.total) * 95),
      fallbackCount,
    });
  });

  onProgress?.({
    phase: 'generating',
    current: total,
    total,
    percent: 98,
    fallbackCount,
  });

  const fonts = resolveThemeFonts(slide);
  const blob = await buildNativePptx(scenes, slide.meta?.title ?? slideId, {
    title: slide.meta?.title ?? slideId,
    fonts,
  });
  downloadBlob(blob, resolveNativePptxFilename(slideId));

  const reports = scenes.map((scene) => scene.report).filter(Boolean) as SceneFidelityReport[];
  onProgress?.({
    phase: 'done',
    current: total,
    total,
    percent: 100,
    fallbackCount,
    reports,
  });
  return reports;
}

export function resolveNativePptxFilename(slideId: string): string {
  return `${slideId}.pptx`;
}

function resolveThemeFonts(slide: SlideModule): { major?: string; minor?: string } {
  const design = slide.design as
    | { fonts?: { display?: string; body?: string }; fontFamily?: string }
    | undefined;
  return {
    major: design?.fonts?.display ?? design?.fontFamily,
    minor: design?.fonts?.body ?? design?.fontFamily,
  };
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export {
  googleSlidesFontFace,
  googleSlidesTextBounds,
  inferTextAlign,
  inferTextValign,
  parseCssColor,
  relativeBounds,
  requiresAtomicRaster,
} from './export-native-scene';

export { buildNativePptx, pxToEmu, validatePptxPackage } from './export-pptx-writer';
