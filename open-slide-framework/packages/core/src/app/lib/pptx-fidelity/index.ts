import { unzipSync } from 'fflate';
import type { NativeSlideScene } from '../export-native-scene';
import { buildNativePptx, validatePptxPackage } from '../export-pptx-writer';
import {
  assertSceneInvariants,
  formatFidelityReport,
  type IrInvariantViolation,
  promoteMeasuredWrap,
  summarizeScenes,
} from './invariants';
import { sceneToSvg } from './scene-to-svg';
import { shouldPromoteMeasuredWrap } from './visual-gate';

export type FidelityGateResult = {
  invariants: IrInvariantViolation[];
  packageErrors: string[];
  svg: string[];
};

export async function runFidelityGate(scenes: NativeSlideScene[]): Promise<FidelityGateResult> {
  const invariants = scenes.flatMap((scene, slideIndex) =>
    assertSceneInvariants(scene).map((violation) => ({
      ...violation,
      message: `slide ${slideIndex + 1}: ${violation.message}`,
    })),
  );

  const blob = await buildNativePptx(scenes, 'fidelity-gate');
  const files = unzipSync(new Uint8Array(await blob.arrayBuffer()));
  const packageErrors = validatePptxPackage(files);
  const svg = scenes.map((scene) => sceneToSvg(scene));

  return { invariants, packageErrors, svg };
}

/**
 * Optional LibreOffice leg. Returns null when `soffice` is unavailable so CI
 * without Office can still run the IR + OOXML gates.
 */
export async function tryRenderWithLibreOffice(
  pptxPath: string,
  outDir: string,
): Promise<string[] | null> {
  try {
    const { spawn } = await import('node:child_process');
    const { access } = await import('node:fs/promises');
    await access(pptxPath);
    await new Promise<void>((resolve, reject) => {
      const child = spawn(
        'soffice',
        ['--headless', '--convert-to', 'pdf', '--outdir', outDir, pptxPath],
        { stdio: 'ignore' },
      );
      child.on('error', reject);
      child.on('exit', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`soffice exited ${code}`));
      });
    });
    return [];
  } catch {
    return null;
  }
}

export {
  assertSceneInvariants,
  formatFidelityReport,
  promoteMeasuredWrap,
  sceneToSvg,
  shouldPromoteMeasuredWrap,
  summarizeScenes,
};
