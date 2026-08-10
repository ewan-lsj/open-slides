import {
  type Bounds,
  captureNativeSlideScenePage,
  flattenTextElement,
  googleSlidesFontFace,
  NATIVE_SCENE_H,
  NATIVE_SCENE_W,
  type NativeSceneElement,
  type NativeSlideScene,
  type SceneColor,
} from './export-native-scene';
import { googleSlidesEditUrl, requestGoogleAccessToken } from './google-oauth';
import type { SlideModule } from './sdk';

const SLIDES_API = 'https://slides.googleapis.com/v1';
const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD = 'https://www.googleapis.com/upload/drive/v3/files';
const BATCH_CHUNK = 200;
const IMAGE_FETCH_RETRIES = 3;
const IMAGE_INSERT_RETRIES = 4;
// Decoding a data URI for upload temporarily creates a binary string,
// Uint8Array, and Blob. Keep this serialized to cap peak memory per page.
const IMAGE_UPLOAD_CONCURRENCY = 1;
const IMAGE_INSERT_CONCURRENCY = 4;
const CLEANUP_CONCURRENCY = 6;

/**
 * Master switch for image/raster export. While `false`, anything that is not
 * natively supported by the Slides API (images, rasterized fallbacks) is
 * skipped entirely — no Drive uploads, no `createImage`. Flip to `true` to
 * re-enable the Drive-hosted image pipeline.
 */
const EXPORT_IMAGES: boolean = true;

// Shared timeline so every log line (including helpers) is stamped with the
// milliseconds elapsed since the current export began.
let exportStartedAt = 0;

function elapsedTag(): string {
  return exportStartedAt ? `+${Math.round(performance.now() - exportStartedAt)}ms` : '';
}

function log(...args: unknown[]): void {
  console.info(`[open-slide][gslides ${elapsedTag()}]`, ...args);
}

function logError(...args: unknown[]): void {
  console.error(`[open-slide][gslides ${elapsedTag()}]`, ...args);
}

export type GoogleSlidesExportProgress = {
  phase: 'authorizing' | 'capturing' | 'uploading' | 'creating' | 'notes' | 'cleanup' | 'done';
  current: number;
  total: number;
  percent: number;
  fallbackCount?: number;
};

export type GoogleSlidesExportResult = {
  presentationId: string;
  url: string;
  imageTotal: number;
  imageFailures: number;
};

export class GoogleSlidesExportError extends Error {
  constructor(
    message: string,
    readonly code?: 'setup' | 'auth' | 'api' | 'cleanup',
    readonly url?: string,
  ) {
    super(message);
    this.name = 'GoogleSlidesExportError';
  }
}

class GoogleApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'GoogleApiError';
  }
}

type PageSize = {
  width: { magnitude: number; unit: string };
  height: { magnitude: number; unit: string };
};

type SlidesRequest = Record<string, unknown>;

type TempAsset = {
  fileId: string;
  permissionId?: string;
};

type Scale = { x: number; y: number; font: number };

export function buildGoogleSlidesRequests(
  scenes: NativeSlideScene[],
  slideObjectIds: string[],
  pageSize: PageSize,
  imageUrls: Map<string, string>,
): SlidesRequest[] {
  const base = buildGoogleSlidesBaseRequests(scenes, slideObjectIds, pageSize);
  const images = buildGoogleSlidesImageRequests(scenes, slideObjectIds, pageSize, imageUrls);
  return [...base, ...images.map((entry) => entry.request)];
}

/**
 * Backgrounds, text, and shapes only — everything that does not depend on
 * externally hosted images. Inserted first so the deck is populated and
 * openable regardless of image hosting.
 */
export function buildGoogleSlidesBaseRequests(
  scenes: NativeSlideScene[],
  slideObjectIds: string[],
  pageSize: PageSize,
  slideIndexOffset = 0,
): SlidesRequest[] {
  const scale = pageScale(pageSize);
  const requests: SlidesRequest[] = [];

  for (let slideIndex = 0; slideIndex < scenes.length; slideIndex++) {
    const scene = scenes[slideIndex];
    const pageObjectId = slideObjectIds[slideIndex];
    if (!scene || !pageObjectId) continue;

    if (scene.background) {
      requests.push(backgroundRequest(pageObjectId, scene.background));
    }

    scene.elements.forEach((element, elementIndex) => {
      if (element.kind === 'image' || element.kind === 'raster' || element.kind === 'svg') return;
      const objectId = elementObjectId(slideIndex + slideIndexOffset, elementIndex);
      const props = elementProperties(pageObjectId, element.bounds, scale);
      if (element.kind === 'shape') {
        requests.push(...shapeRequests(objectId, props, element, scale.font));
      } else if (element.kind === 'text') {
        requests.push(...textRequests(objectId, props, element, scale.font));
      }
    });
  }

  return requests;
}

/**
 * One `createImage` request per image/raster element that has a resolved
 * public URL. Returned individually so each can be inserted (and retried or
 * skipped) without aborting the rest of the deck.
 */
export function buildGoogleSlidesImageRequests(
  scenes: NativeSlideScene[],
  slideObjectIds: string[],
  pageSize: PageSize,
  imageUrls: Map<string, string>,
  slideIndexOffset = 0,
): { objectId: string; request: SlidesRequest }[] {
  const scale = pageScale(pageSize);
  const entries: { objectId: string; request: SlidesRequest }[] = [];

  for (let slideIndex = 0; slideIndex < scenes.length; slideIndex++) {
    const scene = scenes[slideIndex];
    const pageObjectId = slideObjectIds[slideIndex];
    if (!scene || !pageObjectId) continue;

    scene.elements.forEach((element, elementIndex) => {
      if (element.kind !== 'image' && element.kind !== 'raster') return;
      const url = imageUrls.get(element.data);
      if (!url) return;
      const objectId = elementObjectId(slideIndex + slideIndexOffset, elementIndex);
      const props = elementProperties(pageObjectId, element.bounds, scale);
      entries.push({
        objectId,
        request: { createImage: { objectId, url, elementProperties: props } },
      });
    });
  }

  return entries;
}

export function buildSpeakerNotesRequests(
  scenes: NativeSlideScene[],
  speakerNotesObjectIds: string[],
): SlidesRequest[] {
  const requests: SlidesRequest[] = [];
  for (let i = 0; i < scenes.length; i++) {
    const notes = scenes[i]?.notes?.trim();
    const notesObjectId = speakerNotesObjectIds[i];
    if (!notes || !notesObjectId) continue;
    requests.push({
      insertText: {
        objectId: notesObjectId,
        insertionIndex: 0,
        text: notes,
      },
    });
  }
  return requests;
}

export function slideObjectId(index: number): string {
  return `os_sld_${String(index).padStart(3, '0')}`;
}

export function elementObjectId(slideIndex: number, elementIndex: number): string {
  return `os_el_${String(slideIndex).padStart(3, '0')}_${String(elementIndex).padStart(4, '0')}`;
}

export function pageScale(pageSize: PageSize): Scale {
  return {
    x: pageSize.width.magnitude / NATIVE_SCENE_W,
    y: pageSize.height.magnitude / NATIVE_SCENE_H,
    // Scene font and border sizes are based on the 13.333in PPTX canvas.
    // Scale them to the actual Slides page width (10in by default).
    font: pageSize.width.magnitude / 12_192_000,
  };
}

export function parseDataUri(dataUri: string): { mimeType: string; bytes: Uint8Array } {
  const match = dataUri.match(/^data:([^;,]+)?(?:;charset=[^;,]+)?;base64,(.+)$/);
  if (!match) throw new Error('Invalid data URI');
  const mimeType = match[1] || 'application/octet-stream';
  const binary = atob(match[2]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return { mimeType, bytes };
}

function countSceneElements(scenes: NativeSlideScene[]): {
  text: number;
  shape: number;
  image: number;
  raster: number;
  svg: number;
} {
  const counts = { text: 0, shape: 0, image: 0, raster: 0, svg: 0 };
  for (const scene of scenes) {
    for (const element of scene.elements) {
      if (element.kind in counts) counts[element.kind as keyof typeof counts]++;
    }
  }
  return counts;
}

export { googleSlidesEditUrl } from './google-oauth';
export async function exportSlideToGoogleSlides(
  slide: SlideModule,
  slideId: string,
  clientId: string,
  onProgress?: (progress: GoogleSlidesExportProgress) => void,
): Promise<GoogleSlidesExportResult> {
  exportStartedAt = performance.now();

  if (!clientId.trim()) {
    throw new GoogleSlidesExportError(
      'Set googleSlides.clientId in open-slide.config.ts to export directly to Google Slides.',
      'setup',
    );
  }

  const pages = slide.default ?? [];
  if (pages.length === 0) {
    throw new GoogleSlidesExportError('Slide has no pages to export.', 'api');
  }

  const total = pages.length;
  const title = slide.meta?.title ?? slideId;
  log('▶ export started', { slideId, title, pages: total, exportImages: EXPORT_IMAGES });

  onProgress?.({ phase: 'authorizing', current: 0, total, percent: 2 });
  log('requesting Google authorization…');
  const token = await requestGoogleAccessToken(clientId.trim()).catch((err) => {
    logError('authorization failed', err);
    throw new GoogleSlidesExportError(
      err instanceof Error ? err.message : 'Google authorization failed',
      'auth',
    );
  });
  log('authorization granted');

  let fallbackCount = 0;
  let activeTempAssets: TempAsset[] = [];
  let presentationId: string | null = null;

  try {
    onProgress?.({ phase: 'creating', current: 0, total, percent: 5, fallbackCount });
    log('creating presentation…', { title });
    const created = await slidesFetch<{
      presentationId: string;
      slides: { objectId: string }[];
      pageSize: PageSize;
    }>(token, '/presentations', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
    presentationId = created.presentationId;
    log('✓ presentation created', {
      id: presentationId,
      url: googleSlidesEditUrl(presentationId),
    });
    const defaultSlideId = created.slides[0]?.objectId;
    if (!defaultSlideId) throw new GoogleSlidesExportError('Presentation has no slides.', 'api');

    const slideObjectIds = pages.map((_, index) => slideObjectId(index));
    const setupRequests: SlidesRequest[] = [];
    // Always replace Google's initial layout slide. Reusing it for a
    // single-page export leaves its title/subtitle placeholders visible.
    for (let i = 0; i < pages.length; i++) {
      setupRequests.push({
        createSlide: {
          objectId: slideObjectIds[i],
          insertionIndex: i,
          slideLayoutReference: { predefinedLayout: 'BLANK' },
        },
      });
    }
    setupRequests.push({ deleteObject: { objectId: defaultSlideId } });

    log(`configuring ${pages.length} slide(s) (${setupRequests.length} setup request(s))…`);
    await batchUpdate(token, presentationId, setupRequests);
    log('✓ slides configured');

    const presentation = await slidesFetch<{
      slides: {
        objectId: string;
        slideProperties?: { notesPage?: { notesProperties?: { speakerNotesObjectId?: string } } };
      }[];
    }>(
      token,
      `/presentations/${presentationId}?fields=slides(objectId,slideProperties(notesPage(notesProperties(speakerNotesObjectId))))`,
    );
    const speakerNotesObjectIds = slideObjectIds.map((id) => {
      const match = presentation.slides.find((entry) => entry.objectId === id);
      return match?.slideProperties?.notesPage?.notesProperties?.speakerNotesObjectId ?? '';
    });

    log(`streaming ${total} page(s) through capture → insert → release`);
    let imageTotal = 0;
    let imageFailures = 0;
    let skippedImages = 0;

    for (let index = 0; index < total; index++) {
      const pageNumber = index + 1;
      const pagePercentStart = 10 + (index / total) * 85;
      onProgress?.({
        phase: 'capturing',
        current: index,
        total,
        percent: pagePercentStart,
        fallbackCount,
      });
      log(`page ${pageNumber}/${total}: mounting and capturing…`);

      const scene = await captureNativeSlideScenePage(slide, index, 'google-slides');
      fallbackCount += scene.fallbackCount;
      const counts = countSceneElements([scene]);
      log(`page ${pageNumber}/${total}: capture complete`, {
        ...counts,
        fallbacks: scene.fallbackCount,
      });

      const pageObjectId = slideObjectIds[index];
      if (!pageObjectId) throw new Error(`Missing Google Slides page id for page ${pageNumber}`);

      const baseRequests = buildGoogleSlidesBaseRequests(
        [scene],
        [pageObjectId],
        created.pageSize,
        index,
      );
      onProgress?.({
        phase: 'creating',
        current: pageNumber,
        total,
        percent: pagePercentStart + 2,
        fallbackCount,
      });
      log(`page ${pageNumber}/${total}: inserting ${baseRequests.length} native request(s)…`);
      await batchUpdate(token, presentationId, baseRequests);

      const pageImageElements = counts.image + counts.raster;
      if (EXPORT_IMAGES && pageImageElements > 0) {
        const imageDataUris = collectSceneImages([scene]);
        const pageTempAssets: TempAsset[] = [];
        activeTempAssets = pageTempAssets;
        log(`page ${pageNumber}/${total}: uploading ${imageDataUris.length} image(s)…`);
        onProgress?.({
          phase: 'uploading',
          current: 0,
          total: imageDataUris.length,
          percent: pagePercentStart + 4,
          fallbackCount,
        });
        const { urls: imageUrls, failures: uploadFailures } = await uploadSceneImages(
          token,
          imageDataUris,
          pageTempAssets,
          (current, imageCount) => {
            log(`page ${pageNumber}/${total}: processed upload ${current}/${imageCount}`);
            onProgress?.({
              phase: 'uploading',
              current,
              total: imageCount,
              percent: pagePercentStart + 5,
              fallbackCount,
            });
          },
        );
        if (uploadFailures.length > 0) {
          logError(
            `page ${pageNumber}/${total}: ${uploadFailures.length} image upload(s) failed`,
            uploadFailures,
          );
        }

        const imageRequests = buildGoogleSlidesImageRequests(
          [scene],
          [pageObjectId],
          created.pageSize,
          imageUrls,
          index,
        );
        const missingImages = pageImageElements - imageRequests.length;
        imageTotal += pageImageElements;
        imageFailures += missingImages;
        let insertedImages = 0;
        log(
          `page ${pageNumber}/${total}: inserting ${imageRequests.length}/${pageImageElements} image(s)…`,
        );
        await runWithConcurrency(imageRequests, IMAGE_INSERT_CONCURRENCY, async (entry) => {
          const inserted = await insertImageWithRetry(
            token,
            presentationId as string,
            entry.request,
          );
          if (inserted) {
            insertedImages++;
          } else {
            imageFailures++;
            logError(`page ${pageNumber}/${total}: failed to insert image`, entry.objectId);
          }
          onProgress?.({
            phase: 'creating',
            current: insertedImages,
            total: imageRequests.length,
            percent: pagePercentStart + 7,
            fallbackCount,
          });
        });
        log(
          `page ${pageNumber}/${total}: inserted ${insertedImages}/${imageRequests.length} image(s)`,
        );
        scheduleTempAssetCleanup(token, pageTempAssets);
        activeTempAssets = [];
      } else if (!EXPORT_IMAGES && pageImageElements > 0) {
        skippedImages += pageImageElements;
        imageTotal += pageImageElements;
        imageFailures += pageImageElements;
      }

      const notesObjectId = speakerNotesObjectIds[index];
      const notesRequests = buildSpeakerNotesRequests([scene], [notesObjectId ?? '']);
      if (notesRequests.length > 0) {
        onProgress?.({
          phase: 'notes',
          current: pageNumber,
          total,
          percent: pagePercentStart + 8,
          fallbackCount,
        });
        await batchUpdate(token, presentationId, notesRequests);
      }

      // Drop all base64 payload references before mounting the next page, then
      // yield so the browser can reclaim detached DOM/canvas memory.
      scene.elements.length = 0;
      log(`page ${pageNumber}/${total}: complete; released captured scene`);
      await yieldToBrowser();
    }

    onProgress?.({ phase: 'done', current: total, total, percent: 100, fallbackCount });

    log('✅ export complete', {
      url: googleSlidesEditUrl(presentationId),
      skippedImages: EXPORT_IMAGES ? 0 : skippedImages,
      imageTotal,
      imageFailures,
      elapsedMs: Math.round(performance.now() - exportStartedAt),
    });

    return {
      presentationId,
      url: googleSlidesEditUrl(presentationId),
      imageTotal,
      imageFailures,
    };
  } catch (err) {
    if (presentationId) {
      console.warn(
        '[open-slide] Google Slides export failed after creating a presentation; preserving partial deck',
        googleSlidesEditUrl(presentationId),
      );
    }
    logError('✖ export failed', err);
    if (err instanceof GoogleSlidesExportError) {
      if (presentationId && !err.url) {
        throw new GoogleSlidesExportError(
          err.message,
          err.code,
          googleSlidesEditUrl(presentationId),
        );
      }
      throw err;
    }
    throw new GoogleSlidesExportError(
      err instanceof Error ? err.message : 'Google Slides export failed',
      'api',
      presentationId ? googleSlidesEditUrl(presentationId) : undefined,
    );
  } finally {
    if (activeTempAssets.length > 0) scheduleTempAssetCleanup(token, activeTempAssets);
  }
}

function shapeRequests(
  objectId: string,
  props: Record<string, unknown>,
  element: Extract<NativeSceneElement, { kind: 'shape' }>,
  fontScale: number,
): SlidesRequest[] {
  const requests: SlidesRequest[] = [
    {
      createShape: {
        objectId,
        shapeType: element.radius > 0 ? 'ROUND_RECTANGLE' : 'RECTANGLE',
        elementProperties: props,
      },
    },
  ];

  const fields = ['shapeBackgroundFill', 'outline'];
  const shapeProperties: Record<string, unknown> = {
    shapeBackgroundFill: { propertyState: 'NOT_RENDERED' },
    outline: { propertyState: 'NOT_RENDERED' },
  };

  if (element.fill) {
    shapeProperties.shapeBackgroundFill = {
      solidFill: solidFill(element.fill),
    };
  }

  if (element.line) {
    shapeProperties.outline = {
      outlineFill: { solidFill: solidFill(element.line) },
      weight: { magnitude: element.line.width * fontScale, unit: 'PT' },
    };
  }

  requests.push({
    updateShapeProperties: {
      objectId,
      shapeProperties,
      fields: fields.join(','),
    },
  });

  return requests;
}

function textRequests(
  objectId: string,
  props: Record<string, unknown>,
  element: Extract<NativeSceneElement, { kind: 'text' }>,
  fontScale: number,
): SlidesRequest[] {
  const flat = flattenTextElement(element);
  const requests: SlidesRequest[] = [
    {
      createShape: {
        objectId,
        shapeType: 'TEXT_BOX',
        elementProperties: props,
      },
    },
    {
      // Note: `autofit` is intentionally omitted. The Slides API rejects
      // setting any autofit type other than NONE via updateShapeProperties
      // ("Autofit types other than NONE are not supported"). Text boxes are
      // sized to the captured bounds, so autofit is unnecessary anyway.
      updateShapeProperties: {
        objectId,
        shapeProperties: {
          shapeBackgroundFill: { propertyState: 'NOT_RENDERED' },
          outline: { propertyState: 'NOT_RENDERED' },
          contentAlignment: contentAlignment(element.valign),
        },
        fields: 'shapeBackgroundFill,outline,contentAlignment',
      },
    },
    {
      insertText: {
        objectId,
        insertionIndex: 0,
        text: flat.text,
      },
    },
  ];

  if (flat.runs.length === 0) {
    requests.push({
      updateTextStyle: {
        objectId,
        style: {
          foregroundColor: {
            opaqueColor: { rgbColor: toRgb(flat.color.color) },
          },
          bold: flat.bold,
          italic: flat.italic,
          fontFamily: googleSlidesFontFace(flat.fontFace),
          fontSize: { magnitude: flat.fontSize * fontScale, unit: 'PT' },
        },
        textRange: { type: 'ALL' },
        fields: 'foregroundColor,bold,italic,fontFamily,fontSize',
      },
    });
  } else {
    for (const run of flat.runs) {
      requests.push({
        updateTextStyle: {
          objectId,
          style: {
            foregroundColor: {
              opaqueColor: { rgbColor: toRgb(run.color.color) },
            },
            bold: run.bold,
            italic: run.italic,
            fontFamily: googleSlidesFontFace(run.fontFace),
            fontSize: { magnitude: run.fontSize * fontScale, unit: 'PT' },
          },
          textRange: {
            type: 'FIXED_RANGE',
            startIndex: run.start,
            endIndex: run.end,
          },
          fields: 'foregroundColor,bold,italic,fontFamily,fontSize',
        },
      });
    }
  }

  requests.push({
    updateParagraphStyle: {
      objectId,
      style: {
        alignment: paragraphAlignment(flat.align),
      },
      textRange: { type: 'ALL' },
      fields: 'alignment',
    },
  });

  return requests;
}

function backgroundRequest(pageObjectId: string, background: SceneColor): SlidesRequest {
  return {
    updatePageProperties: {
      objectId: pageObjectId,
      pageProperties: {
        pageBackgroundFill: {
          solidFill: solidFill(background),
        },
      },
      fields: 'pageBackgroundFill.solidFill',
    },
  };
}

function elementProperties(
  pageObjectId: string,
  bounds: Bounds,
  scale: Scale,
): Record<string, unknown> {
  return {
    pageObjectId,
    size: {
      width: { magnitude: Math.max(1, bounds.w * scale.x), unit: 'EMU' },
      height: { magnitude: Math.max(1, bounds.h * scale.y), unit: 'EMU' },
    },
    transform: {
      scaleX: 1,
      scaleY: 1,
      translateX: bounds.x * scale.x,
      translateY: bounds.y * scale.y,
      unit: 'EMU',
    },
  };
}

function solidFill(color: SceneColor): Record<string, unknown> {
  return {
    color: { rgbColor: toRgb(color.color) },
    alpha: clamp01(1 - color.transparency / 100),
  };
}

function toRgb(hex: string): { red: number; green: number; blue: number } {
  const normalized = hex.padStart(6, '0').slice(0, 6);
  return {
    red: Number.parseInt(normalized.slice(0, 2), 16) / 255,
    green: Number.parseInt(normalized.slice(2, 4), 16) / 255,
    blue: Number.parseInt(normalized.slice(4, 6), 16) / 255,
  };
}

function paragraphAlignment(align: 'left' | 'center' | 'right' | 'justify'): string {
  if (align === 'center') return 'CENTER';
  if (align === 'right') return 'END';
  if (align === 'justify') return 'JUSTIFIED';
  return 'START';
}

function contentAlignment(valign: 'top' | 'middle' | 'bottom'): string {
  if (valign === 'middle') return 'MIDDLE';
  if (valign === 'bottom') return 'BOTTOM';
  return 'TOP';
}

export function collectSceneImages(scenes: NativeSlideScene[]): string[] {
  const unique = new Set<string>();
  for (const scene of scenes) {
    for (const element of scene.elements) {
      if (element.kind === 'image' || element.kind === 'raster') unique.add(element.data);
    }
  }
  return [...unique];
}

/**
 * Returns a Google-hosted URL that the Slides API can reliably fetch
 * server-side. The classic `drive.google.com/uc?export=download` endpoint
 * frequently returns an HTML virus-scan interstitial instead of the image
 * bytes, which makes `createImage` fail. The `lh3.googleusercontent.com/d/<id>`
 * user-content endpoint serves the raw bytes for any file shared with "anyone".
 */
function driveImageUrl(fileId: string): string {
  return `https://lh3.googleusercontent.com/d/${fileId}`;
}

async function uploadSceneImages(
  token: string,
  dataUris: string[],
  tempAssets: TempAsset[],
  onProgress?: (current: number, total: number) => void,
): Promise<{ urls: Map<string, string>; failures: string[] }> {
  const urls = new Map<string, string>();
  const failures: string[] = [];
  let current = 0;
  await runWithConcurrency(dataUris, IMAGE_UPLOAD_CONCURRENCY, async (dataUri) => {
    try {
      const url = await uploadTemporaryImage(token, dataUri, tempAssets);
      urls.set(dataUri, url);
    } catch (err) {
      failures.push(err instanceof Error ? err.message : 'image upload failed');
      logError('image upload failed', err);
    } finally {
      current++;
      onProgress?.(current, dataUris.length);
    }
  });
  return { urls, failures };
}

async function uploadTemporaryImage(
  token: string,
  dataUri: string,
  tempAssets: TempAsset[],
): Promise<string> {
  const { mimeType, bytes } = parseDataUri(dataUri);
  const extension = mimeType.includes('jpeg') ? 'jpg' : mimeType.includes('gif') ? 'gif' : 'png';
  const file = await driveUpload(
    token,
    `open-slide-export-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`,
    mimeType,
    bytes,
  );
  if (!file.id) throw new Error('Drive upload returned no file id');
  const permission = await driveFetch<{ id: string }>(token, `/files/${file.id}/permissions`, {
    method: 'POST',
    body: JSON.stringify({ role: 'reader', type: 'anyone' }),
  });
  tempAssets.push({ fileId: file.id, permissionId: permission.id });
  return driveImageUrl(file.id);
}

async function driveUpload(
  token: string,
  name: string,
  mimeType: string,
  bytes: Uint8Array,
): Promise<{ id: string }> {
  const boundary = 'open_slide_upload_boundary';
  const metadata = JSON.stringify({ name, mimeType });
  const metaPart = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n`;
  const fileHeader = `--${boundary}\r\nContent-Type: ${mimeType}\r\n\r\n`;
  const footer = `\r\n--${boundary}--`;
  const body = new Blob([metaPart, fileHeader, bytes.slice(), footer]);

  const response = await fetch(`${DRIVE_UPLOAD}?uploadType=multipart`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body,
  });
  if (!response.ok) {
    throw new GoogleApiError(await readApiError(response), response.status);
  }
  return response.json() as Promise<{ id: string }>;
}

async function batchUpdate(
  token: string,
  presentationId: string,
  requests: SlidesRequest[],
): Promise<void> {
  const chunks = Math.ceil(requests.length / BATCH_CHUNK);
  for (let offset = 0, index = 1; offset < requests.length; offset += BATCH_CHUNK, index++) {
    const chunk = requests.slice(offset, offset + BATCH_CHUNK);
    if (chunks > 1) log(`  batchUpdate chunk ${index}/${chunks} (${chunk.length} request(s))`);
    await batchUpdateChunk(token, presentationId, chunk);
  }
}

async function batchUpdateChunk(
  token: string,
  presentationId: string,
  requests: SlidesRequest[],
): Promise<void> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < IMAGE_FETCH_RETRIES; attempt++) {
    try {
      await slidesFetch(token, `/presentations/${presentationId}:batchUpdate`, {
        method: 'POST',
        body: JSON.stringify({ requests }),
      });
      return;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error('Google Slides update failed');
      if (!isRetryableApiError(err) || attempt >= IMAGE_FETCH_RETRIES - 1) break;
      await sleep(400 * (attempt + 1));
    }
  }
  throw lastError ?? new Error('Google Slides update failed');
}

async function slidesFetch<T>(token: string, path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${SLIDES_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  if (!response.ok) throw new GoogleApiError(await readApiError(response), response.status);
  return response.json() as Promise<T>;
}

async function driveFetch<T>(token: string, path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${DRIVE_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  if (!response.ok) throw new GoogleApiError(await readApiError(response), response.status);
  return response.json() as Promise<T>;
}

async function driveDelete(token: string, fileId: string): Promise<void> {
  const response = await fetch(`${DRIVE_API}/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok && response.status !== 404) {
    throw new Error(await readApiError(response));
  }
}

async function cleanupTempAssets(token: string, assets: TempAsset[]): Promise<string[]> {
  const errors: string[] = [];
  await runWithConcurrency(assets, CLEANUP_CONCURRENCY, async (asset) => {
    try {
      if (asset.permissionId) {
        await driveFetch(token, `/files/${asset.fileId}/permissions/${asset.permissionId}`, {
          method: 'DELETE',
        }).catch(() => undefined);
      }
      await driveDelete(token, asset.fileId);
    } catch (err) {
      errors.push(err instanceof Error ? err.message : 'cleanup failed');
    }
  });
  return errors;
}

function scheduleTempAssetCleanup(token: string, assets: TempAsset[]): void {
  if (assets.length === 0) return;
  void cleanupTempAssets(token, assets).then((cleanupErrors) => {
    if (cleanupErrors.length > 0) {
      console.warn(
        '[open-slide] temporary Google Drive assets were not fully cleaned up',
        cleanupErrors,
      );
    }
  });
}

async function runWithConcurrency<T>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<void>,
): Promise<void> {
  let nextIndex = 0;
  let firstError: unknown;
  const workerCount = Math.min(limit, items.length);

  async function runWorker() {
    while (firstError == null) {
      const index = nextIndex++;
      if (index >= items.length) return;
      const item = items[index];
      if (item === undefined) return;
      try {
        await worker(item);
      } catch (err) {
        firstError = err;
      }
    }
  }

  await Promise.all(Array.from({ length: workerCount }, runWorker));
  if (firstError) throw firstError;
}

async function readApiError(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as { error?: { message?: string } };
    if (payload.error?.message) return payload.error.message;
  } catch {
    // ignore parse errors
  }
  return `Google API request failed (${response.status})`;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/**
 * Inserts a single image, retrying to absorb Drive permission propagation
 * delays and transient fetch failures. Returns `false` instead of throwing so
 * one unreachable image never aborts the rest of the deck.
 */
export async function insertImageWithRetry(
  token: string,
  presentationId: string,
  request: SlidesRequest,
): Promise<boolean> {
  const requests = buildImageInsertRequests(request);
  for (let attempt = 0; attempt < IMAGE_INSERT_RETRIES; attempt++) {
    try {
      await slidesFetch(token, `/presentations/${presentationId}:batchUpdate`, {
        method: 'POST',
        body: JSON.stringify({ requests }),
      });
      return true;
    } catch (err) {
      if (isRetryableImageError(err) && attempt < IMAGE_INSERT_RETRIES - 1) {
        await sleep(500 * (attempt + 1));
      } else {
        logError('image insert failed after retries', err);
        return false;
      }
    }
  }
  return false;
}

export function buildImageInsertRequests(request: SlidesRequest): SlidesRequest[] {
  const imageObjectId = (request.createImage as { objectId?: string } | undefined)?.objectId;
  return imageObjectId
    ? [
        request,
        {
          updatePageElementsZOrder: {
            pageElementObjectIds: [imageObjectId],
            operation: 'SEND_TO_BACK',
          },
        },
      ]
    : [request];
}

function isRetryableApiError(err: unknown): boolean {
  return err instanceof GoogleApiError && (err.status === 429 || err.status >= 500);
}

function isRetryableImageError(err: unknown): boolean {
  if (isRetryableApiError(err)) return true;
  if (!(err instanceof GoogleApiError) || err.status !== 400) return false;
  // Slides reports temporary inability to fetch a newly shared Drive image as
  // HTTP 400. Retry those propagation failures, but never retry schema errors.
  return (
    /provided image|image url|fetch.*image|access.*image|download.*image/i.test(err.message) &&
    !/invalid json payload|unknown name|cannot find field/i.test(err.message)
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function yieldToBrowser(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}
