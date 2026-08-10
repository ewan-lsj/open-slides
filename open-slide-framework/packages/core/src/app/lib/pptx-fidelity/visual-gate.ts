/**
 * Visual fidelity gate helpers.
 *
 * Playwright + pixelmatch are optional root devDependencies. When absent,
 * `diffPngBuffers` still works if pixelmatch is installed; browser capture
 * helpers no-op gracefully so unit tests stay node-only.
 */

export type PixelDiffResult = {
  mismatchedPixels: number;
  width: number;
  height: number;
  ratio: number;
};

export async function diffPngBuffers(
  expected: Uint8Array,
  actual: Uint8Array,
  threshold = 0.1,
): Promise<PixelDiffResult | null> {
  try {
    const pixelmatch = (await import('pixelmatch')).default;
    const { PNG } = await import('pngjs');
    const a = PNG.sync.read(Buffer.from(expected));
    const b = PNG.sync.read(Buffer.from(actual));
    if (a.width !== b.width || a.height !== b.height) {
      return {
        mismatchedPixels: a.width * a.height,
        width: a.width,
        height: a.height,
        ratio: 1,
      };
    }
    const diff = new PNG({ width: a.width, height: a.height });
    const mismatchedPixels = pixelmatch(a.data, b.data, diff.data, a.width, a.height, {
      threshold,
    });
    return {
      mismatchedPixels,
      width: a.width,
      height: a.height,
      ratio: mismatchedPixels / (a.width * a.height),
    };
  } catch {
    return null;
  }
}

export async function capturePageScreenshot(url: string): Promise<Uint8Array | null> {
  try {
    const { chromium } = await import('playwright');
    const browser = await chromium.launch({ headless: true });
    try {
      const page = await browser.newPage({
        viewport: { width: 1920, height: 1080 },
      });
      await page.goto(url, { waitUntil: 'networkidle' });
      const bytes = await page.screenshot({ type: 'png', fullPage: false });
      return Uint8Array.from(bytes);
    } finally {
      await browser.close();
    }
  } catch {
    return null;
  }
}

export function shouldPromoteMeasuredWrap(diffRatio: number, budget = 0.02): boolean {
  return diffRatio > budget;
}
