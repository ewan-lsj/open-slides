import { createElement } from 'react';
import { flushSync } from 'react-dom';
import { createRoot, type Root } from 'react-dom/client';
import { designToCssVars } from './design';
import { SlidePageProvider } from './page-context';
import { isFrameAnimationSettled, waitForDataWaitfor, waitForFonts } from './print-ready';
import type { SlideModule } from './sdk';

export const NATIVE_SCENE_W = 1920;
export const NATIVE_SCENE_H = 1080;
export const PX_PER_IN = 144;
export const EMU_PER_PX = 6350;
export const PT_PER_PX = 0.5;
const PX_TO_PT = PT_PER_PX;
const ANIMATION_TIMEOUT_MS = 15_000;
const POLL_INTERVAL_MS = 100;
const CAPTURE_CLASS = 'os-native-scene-capture';
const CAPTURE_STYLE_ID = 'os-native-scene-capture-style';
const ATOMIC_RASTER_TAGS = new Set(['CANVAS', 'IFRAME', 'OBJECT', 'VIDEO']);
const INLINE_TAGS = new Set([
  'A',
  'ABBR',
  'B',
  'BDI',
  'BDO',
  'BR',
  'CITE',
  'CODE',
  'DATA',
  'DFN',
  'EM',
  'I',
  'KBD',
  'MARK',
  'Q',
  'S',
  'SAMP',
  'SMALL',
  'SPAN',
  'STRONG',
  'SUB',
  'SUP',
  'TIME',
  'U',
  'VAR',
  'WBR',
]);
const FROZEN_PROPS = ['opacity', 'transform', 'filter', 'clip-path'] as const;
const GOOGLE_SLIDES_SAFE_FONTS = new Set(
  [
    'Arial',
    'Arial Narrow',
    'Comic Sans MS',
    'Courier New',
    'Georgia',
    'Inter',
    'Lato',
    'Merriweather',
    'Montserrat',
    'Nunito',
    'Open Sans',
    'Oswald',
    'Playfair Display',
    'Poppins',
    'Raleway',
    'Roboto',
    'Roboto Condensed',
    'Source Sans 3',
    'Times New Roman',
    'Trebuchet MS',
    'Verdana',
  ].map((font) => font.toLowerCase()),
);

export type Bounds = { x: number; y: number; w: number; h: number };
export type SceneColor = { color: string; transparency: number };
export type NativeSceneProfile = 'powerpoint' | 'google-slides';
export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type TextValign = 'top' | 'middle' | 'bottom';
export type WrapMode = 'reflow' | 'measured';

export type GradientStop = { offset: number; color: SceneColor };
export type GradientFill = {
  kind: 'linear' | 'radial';
  angle?: number;
  stops: GradientStop[];
};

export type Shadow = {
  color: SceneColor;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  inset: boolean;
};

export type SideBorder = { color: SceneColor; width: number };
export type SideBorders = {
  top?: SideBorder;
  right?: SideBorder;
  bottom?: SideBorder;
  left?: SideBorder;
};

export type TextRun = {
  text: string;
  color: SceneColor;
  fontFace: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  underline?: boolean;
  charSpacing?: number;
};

export type TextParagraph = {
  runs: TextRun[];
  align: TextAlign;
  lineSpacing?: number;
};

export type NativeSceneElement =
  | {
      kind: 'shape';
      bounds: Bounds;
      fill?: SceneColor;
      gradient?: GradientFill;
      line?: SceneColor & { width: number };
      radius: number;
      radii?: { tl: number; tr: number; br: number; bl: number };
      shadow?: Shadow;
      borders?: SideBorders;
      reason?: string;
    }
  | {
      kind: 'text';
      bounds: Bounds;
      paragraphs: TextParagraph[];
      valign: TextValign;
      wrapMode: WrapMode;
      /** CSS padding on the text-block element itself, in px (border-box → content-box). */
      insets?: { left: number; top: number; right: number; bottom: number };
      fill?: SceneColor;
      gradient?: GradientFill;
      line?: SceneColor & { width: number };
      radius?: number;
      shadow?: Shadow;
      borders?: SideBorders;
    }
  | {
      kind: 'image';
      bounds: Bounds;
      data: string;
      fit: 'contain' | 'cover' | 'fill';
      transparency: number;
      altText?: string;
    }
  | {
      kind: 'svg';
      bounds: Bounds;
      svg: string;
      pngFallback?: string;
      transparency: number;
      altText?: string;
    }
  | {
      kind: 'raster';
      bounds: Bounds;
      data: string;
      reason?: string;
    };

export type NativeSlideScene = {
  elements: NativeSceneElement[];
  fallbackCount: number;
  background?: SceneColor;
  notes?: string;
  report?: SceneFidelityReport;
};

export type SceneFidelityReport = {
  nativeCount: number;
  rasterCount: number;
  textCount: number;
  shapeCount: number;
  imageCount: number;
  rasterReasons: Record<string, number>;
};

export type SceneCaptureProgress = {
  current: number;
  total: number;
  fallbackCount: number;
};

export function googleSlidesFontFace(fontFace: string): string {
  const normalized = fontFace.trim().replace(/^['"]|['"]$/g, '');
  return GOOGLE_SLIDES_SAFE_FONTS.has(normalized.toLowerCase()) ? normalized : 'Arial';
}

export function flattenTextElement(element: Extract<NativeSceneElement, { kind: 'text' }>): {
  text: string;
  color: SceneColor;
  fontFace: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  align: TextAlign;
  valign: TextValign;
  charSpacing?: number;
  lineSpacing?: number;
  runs: Array<TextRun & { start: number; end: number }>;
} {
  const runs: Array<TextRun & { start: number; end: number }> = [];
  const parts: string[] = [];
  let offset = 0;
  for (let i = 0; i < element.paragraphs.length; i++) {
    if (i > 0) {
      parts.push('\n');
      offset += 1;
    }
    for (const run of element.paragraphs[i].runs) {
      if (!run.text) continue;
      parts.push(run.text);
      runs.push({ ...run, start: offset, end: offset + run.text.length });
      offset += run.text.length;
    }
  }
  const first = runs[0];
  const firstParagraph = element.paragraphs[0];
  return {
    text: parts.join(''),
    color: first?.color ?? { color: '000000', transparency: 0 },
    fontFace: first?.fontFace ?? 'Arial',
    fontSize: first?.fontSize ?? 16,
    bold: first?.bold ?? false,
    italic: first?.italic ?? false,
    align: firstParagraph?.align ?? 'left',
    valign: element.valign,
    charSpacing: first?.charSpacing,
    lineSpacing: firstParagraph?.lineSpacing,
    runs,
  };
}

export function buildSceneFidelityReport(scene: NativeSlideScene): SceneFidelityReport {
  const rasterReasons: Record<string, number> = {};
  let nativeCount = 0;
  let rasterCount = 0;
  let textCount = 0;
  let shapeCount = 0;
  let imageCount = 0;
  for (const element of scene.elements) {
    if (element.kind === 'raster') {
      rasterCount++;
      const reason = element.reason ?? 'unknown';
      rasterReasons[reason] = (rasterReasons[reason] ?? 0) + 1;
    } else {
      nativeCount++;
      if (element.kind === 'text') textCount++;
      if (element.kind === 'shape') shapeCount++;
      if (element.kind === 'image' || element.kind === 'svg') imageCount++;
    }
  }
  return { nativeCount, rasterCount, textCount, shapeCount, imageCount, rasterReasons };
}

export async function captureNativeSlideScenes(
  slide: SlideModule,
  profile: NativeSceneProfile,
  onProgress?: (progress: SceneCaptureProgress) => void,
): Promise<NativeSlideScene[]> {
  const pages = slide.default ?? [];
  if (pages.length === 0) return [];

  const scenes: NativeSlideScene[] = [];
  let fallbackCount = 0;
  for (let index = 0; index < pages.length; index++) {
    const scene = await captureNativeSlideScenePage(slide, index, profile);
    scenes.push(scene);
    fallbackCount += scene.fallbackCount;
    onProgress?.({ current: index + 1, total: pages.length, fallbackCount });
  }
  return scenes;
}

/**
 * Capture exactly one page and dispose its React tree immediately. Google
 * Slides export uses this directly so raster data never accumulates for the
 * whole deck.
 */
export async function captureNativeSlideScenePage(
  slide: SlideModule,
  index: number,
  profile: NativeSceneProfile,
): Promise<NativeSlideScene> {
  const capture = mountPage(slide, index);
  try {
    await waitUntilReady(capture.container, [capture.frame]);
    freezeForCapture(capture.frame);
    return await extractNativeSlideScene(capture.frame, slide.notes?.[index], profile);
  } finally {
    capture.dispose();
  }
}

export async function extractNativeSlideScene(
  frame: HTMLElement,
  notes?: string,
  profile: NativeSceneProfile = 'powerpoint',
): Promise<NativeSlideScene> {
  const frameRect = frame.getBoundingClientRect();
  const rasterPixelRatio = profile === 'google-slides' ? 1 : 2;
  const elements: NativeSceneElement[] = [];
  const consumed = new WeakSet<Element>();
  let fallbackCount = 0;
  let background = resolveCssColor(getComputedStyle(frame).backgroundColor);

  if (hasUnsupportedDecoration(getComputedStyle(frame), profile)) {
    elements.push(
      await rasterize(frame, frameRect, frameRect, true, rasterPixelRatio, 'frame-decoration'),
    );
    fallbackCount++;
  }

  const visit = async (element: Element): Promise<void> => {
    if (!(element instanceof HTMLElement || element instanceof SVGElement)) return;
    if (consumed.has(element)) return;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    if (!isVisible(style, rect, frameRect)) return;

    if (element instanceof SVGSVGElement) {
      const svg = await serializeSvg(element);
      if (svg && profile === 'powerpoint') {
        const pngFallback = await svgToPngDataUri(svg, rect.width, rect.height);
        elements.push({
          kind: 'svg',
          bounds: relativeBounds(rect, frameRect),
          svg,
          pngFallback,
          transparency: opacityToTransparency(style.opacity),
          altText: element.getAttribute('aria-label') || undefined,
        });
      } else {
        elements.push(await rasterize(element, rect, frameRect, false, rasterPixelRatio, 'svg'));
        fallbackCount++;
      }
      return;
    }

    if (requiresAtomicRaster(element, style) || clipsDescendants(element, style, rect, frameRect)) {
      const reason = requiresAtomicRaster(element, style) ? 'atomic' : 'overflow-clip';
      elements.push(await rasterize(element, rect, frameRect, false, rasterPixelRatio, reason));
      fallbackCount++;
      markConsumed(element, consumed);
      return;
    }

    const textBlockRoot = element instanceof HTMLElement && isTextBlockRoot(element, style);
    const decoration = decorationFromStyle(style, profile);

    if (hasUnsupportedDecoration(style, profile) && !decoration) {
      elements.push(
        await rasterize(element, rect, frameRect, true, rasterPixelRatio, 'decoration'),
      );
      fallbackCount++;
    } else if (hasVisiblePseudoElement(element)) {
      elements.push(
        await rasterize(element, rect, frameRect, true, rasterPixelRatio, 'pseudo-element'),
      );
      fallbackCount++;
    } else if (!textBlockRoot) {
      const shape = shapeFromElement(element, rect, frameRect, decoration);
      if (
        shape?.kind === 'shape' &&
        shape.fill &&
        !shape.line &&
        !shape.gradient &&
        !shape.shadow &&
        !shape.borders &&
        shape.fill.transparency === 0 &&
        coversFrame(rect, frameRect)
      ) {
        background = shape.fill;
      } else if (shape) {
        elements.push(shape);
      }
    }

    if (element instanceof HTMLImageElement) {
      const data = await sourceToDataUri(element.currentSrc || element.src);
      if (data) {
        if (profile === 'google-slides' && data.startsWith('data:image/svg')) {
          elements.push(
            await rasterize(element, rect, frameRect, false, rasterPixelRatio, 'svg-image'),
          );
          fallbackCount++;
        } else if (data.startsWith('data:image/svg') && profile === 'powerpoint') {
          const svgText = await dataUriToText(data);
          const pngFallback =
            (await rasterizeToPngDataUri(element, rect)) ??
            (svgText ? await svgToPngDataUri(svgText, rect.width, rect.height) : undefined);
          elements.push({
            kind: 'svg',
            bounds: relativeBounds(rect, frameRect),
            svg: svgText ?? data,
            pngFallback,
            transparency: opacityToTransparency(style.opacity),
            altText: element.alt || undefined,
          });
        } else {
          elements.push({
            kind: 'image',
            bounds: relativeBounds(rect, frameRect),
            data,
            fit: imageFit(style.objectFit),
            transparency: opacityToTransparency(style.opacity),
            altText: element.alt || undefined,
          });
        }
      } else {
        elements.push(
          await rasterize(element, rect, frameRect, false, rasterPixelRatio, 'image-fetch'),
        );
        fallbackCount++;
      }
      return;
    }

    if (textBlockRoot && element instanceof HTMLElement) {
      const textElement = textFromBlock(element, style, rect, frameRect, profile);
      if (textElement) {
        const shapeExtras = shapeExtrasFromElement(style, profile);
        elements.push({ ...textElement, ...shapeExtras });
        markTextDescendantsConsumed(element, consumed);
      }
    }

    for (const child of sortedChildren(element)) await visit(child);
  };

  for (const child of sortedChildren(frame)) await visit(child);
  const scene: NativeSlideScene = { elements, fallbackCount, background, notes };
  scene.report = buildSceneFidelityReport(scene);
  return scene;
}

export function relativeBounds(rect: DOMRect, frameRect: DOMRect): Bounds {
  return {
    x: rect.left - frameRect.left,
    y: rect.top - frameRect.top,
    w: rect.width,
    h: rect.height,
  };
}

export function googleSlidesTextBounds(
  textRect: DOMRect,
  containerRect: DOMRect,
  frameRect: DOMRect,
  textAlignValue: string,
  fontSizePx: number,
): Bounds {
  const textBounds = relativeBounds(textRect, frameRect);
  const containerBounds = relativeBounds(containerRect, frameRect);
  const contained =
    containerRect.left <= textRect.left + 0.5 &&
    containerRect.top <= textRect.top + 0.5 &&
    containerRect.right >= textRect.right - 0.5 &&
    containerRect.bottom >= textRect.bottom - 0.5;
  const useContainer =
    contained &&
    containerBounds.w >= textBounds.w &&
    containerBounds.h >= textBounds.h &&
    containerBounds.w > 0 &&
    containerBounds.h > 0;
  const bounds = useContainer ? { ...containerBounds } : { ...textBounds };
  const safeFontSize = Number.isFinite(fontSizePx) ? fontSizePx : 16;
  const horizontalTolerance = Math.max(8, safeFontSize * 0.4, textBounds.w * 0.2);

  if (bounds.w <= textBounds.w + 1) {
    if (textAlignValue === 'center') bounds.x -= horizontalTolerance / 2;
    if (textAlignValue === 'right' || textAlignValue === 'end') bounds.x -= horizontalTolerance;
    bounds.w += horizontalTolerance;
  }

  bounds.h = Math.max(bounds.h, safeFontSize * 1.35);
  const right = Math.min(frameRect.width, bounds.x + bounds.w);
  const bottom = Math.min(frameRect.height, bounds.y + bounds.h);
  bounds.x = Math.max(0, bounds.x);
  bounds.y = Math.max(0, bounds.y);
  bounds.w = Math.max(1, right - bounds.x);
  bounds.h = Math.max(1, bottom - bounds.y);
  return bounds;
}

export function parseCssColor(value: string): SceneColor | undefined {
  const normalized = value.trim().toLowerCase();
  if (!normalized || normalized === 'transparent') return undefined;
  const hex = normalized.match(/^#([\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i);
  if (hex) {
    const source = hex[1];
    const expanded =
      source.length === 3
        ? source
            .split('')
            .map((part) => part + part)
            .join('')
        : source;
    const alpha = expanded.length === 8 ? Number.parseInt(expanded.slice(6), 16) / 255 : 1;
    if (alpha <= 0) return undefined;
    return { color: expanded.slice(0, 6).toUpperCase(), transparency: (1 - alpha) * 100 };
  }

  const rgb = normalized.match(/^rgba?\(([^)]+)\)$/);
  if (!rgb) return undefined;
  const parts = rgb[1].split(/[,\s/]+/).filter(Boolean);
  if (parts.length < 3) return undefined;
  const channels = parts.slice(0, 3).map((part) => {
    if (part.endsWith('%')) return Math.round((Number.parseFloat(part) / 100) * 255);
    return Number.parseFloat(part);
  });
  if (channels.some((channel) => !Number.isFinite(channel))) return undefined;
  const alphaPart = parts[3];
  const alpha = alphaPart
    ? alphaPart.endsWith('%')
      ? Number.parseFloat(alphaPart) / 100
      : Number.parseFloat(alphaPart)
    : 1;
  if (alpha <= 0) return undefined;
  return {
    color: channels
      .map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase(),
    transparency: (1 - clamp(alpha, 0, 1)) * 100,
  };
}

export function applyTextTransform(text: string, transform: string): string {
  switch (transform) {
    case 'uppercase':
      return text.toUpperCase();
    case 'lowercase':
      return text.toLowerCase();
    case 'capitalize':
      return text.replace(/\b\p{L}/gu, (char) => char.toUpperCase());
    default:
      return text;
  }
}

function resolveCssColor(value: string): SceneColor | undefined {
  const parsed = parseCssColor(value);
  if (parsed || typeof document === 'undefined') return parsed;
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const context = canvas.getContext('2d');
  if (!context) return undefined;
  try {
    context.clearRect(0, 0, 1, 1);
    context.fillStyle = value;
    context.fillRect(0, 0, 1, 1);
    const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;
    if (alpha === 0) return undefined;
    return {
      color: [red, green, blue]
        .map((channel) => channel.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase(),
      transparency: 100 - (alpha / 255) * 100,
    };
  } catch {
    return undefined;
  }
}

export function requiresAtomicRaster(element: Element, style: CSSStyleDeclaration): boolean {
  if ((element as HTMLElement).dataset?.pptxRaster !== undefined) return true;
  if (ATOMIC_RASTER_TAGS.has(element.tagName)) return true;
  if (style.mixBlendMode !== 'normal' || style.backdropFilter !== 'none') return true;
  const radius = Number.parseFloat(style.borderTopLeftRadius) || 0;
  if (element.tagName === 'IMG' && radius > 0) return true;
  if (
    radius > 0 &&
    element.children.length > 0 &&
    Array.from(element.children).every((child) => child.tagName === 'SVG')
  ) {
    return true;
  }
  if (
    (style.clipPath && style.clipPath !== 'none') ||
    (radius > 0 &&
      (style.overflow === 'hidden' ||
        style.overflowX === 'hidden' ||
        style.overflowY === 'hidden') &&
      element.children.length > 0)
  ) {
    return true;
  }
  const opacity = Number.parseFloat(style.opacity);
  if (Number.isFinite(opacity) && opacity < 1 && element.children.length > 0) return true;
  const transform = style.transform;
  if (!transform || transform === 'none') return false;
  const matrix = transform.match(/^matrix\(([^)]+)\)$/);
  if (!matrix) return true;
  const values = matrix[1].split(',').map(Number);
  return (
    values.length !== 6 ||
    Math.abs(values[0] - 1) > 0.0001 ||
    Math.abs(values[1]) > 0.0001 ||
    Math.abs(values[2]) > 0.0001 ||
    Math.abs(values[3] - 1) > 0.0001
  );
}

function mountPage(
  slide: SlideModule,
  index: number,
): {
  container: HTMLElement;
  frame: HTMLElement;
  dispose: () => void;
} {
  const container = document.createElement('div');
  container.className = CAPTURE_CLASS;
  container.setAttribute('aria-hidden', 'true');
  Object.assign(container.style, {
    position: 'fixed',
    left: '-99999px',
    top: '0',
    pointerEvents: 'none',
  });
  document.body.appendChild(container);

  const captureStyle = document.createElement('style');
  captureStyle.id = CAPTURE_STYLE_ID;
  captureStyle.textContent = `.${CAPTURE_CLASS} *, .${CAPTURE_CLASS} *::before, .${CAPTURE_CLASS} *::after {
    animation-delay: -1s !important;
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    animation-fill-mode: forwards !important;
    transition: none !important;
  }`;
  document.head.appendChild(captureStyle);

  const designVars = slide.design ? designToCssVars(slide.design) : null;
  const Page = slide.default[index];
  if (!Page) {
    container.remove();
    captureStyle.remove();
    throw new Error(`Slide page ${index + 1} does not exist`);
  }
  const frame = document.createElement('div');
  frame.setAttribute('data-osd-canvas', '');
  Object.assign(frame.style, {
    width: `${NATIVE_SCENE_W}px`,
    height: `${NATIVE_SCENE_H}px`,
    overflow: 'hidden',
    background: '#fff',
  });
  if (designVars) {
    for (const [key, value] of Object.entries(designVars)) frame.style.setProperty(key, value);
  }
  container.appendChild(frame);
  const root: Root = createRoot(frame);
  flushSync(() => {
    root.render(
      createElement(SlidePageProvider, { index, total: slide.default.length }, createElement(Page)),
    );
  });

  return {
    container,
    frame,
    dispose: () => {
      flushSync(() => {
        root.unmount();
      });
      container.remove();
      captureStyle.remove();
    },
  };
}

async function waitUntilReady(container: HTMLElement, frames: HTMLElement[]): Promise<void> {
  await nextPaint();
  await nextPaint();
  await waitForCommittedContent(frames);
  await waitForFonts();
  const deadline = performance.now() + ANIMATION_TIMEOUT_MS;
  while (performance.now() < deadline) {
    if (frames.every((frame) => isFrameAnimationSettled(frame))) break;
    await sleep(POLL_INTERVAL_MS);
  }
  await waitForDataWaitfor(container);
}

async function waitForCommittedContent(frames: HTMLElement[]): Promise<void> {
  const deadline = performance.now() + ANIMATION_TIMEOUT_MS;
  while (performance.now() < deadline) {
    const ready = frames.every((frame) => {
      const child = frame.firstElementChild;
      if (!(child instanceof HTMLElement)) return false;
      const rect = child.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
    if (ready) return;
    await sleep(POLL_INTERVAL_MS);
  }
  throw new Error('Timed out waiting for slide page content to commit before PPTX capture');
}

function freezeForCapture(root: HTMLElement): void {
  for (const element of root.querySelectorAll<HTMLElement>('*')) {
    const style = getComputedStyle(element);
    for (const property of FROZEN_PROPS) {
      element.style.setProperty(property, style.getPropertyValue(property), 'important');
    }
    element.style.setProperty('animation', 'none', 'important');
    element.style.setProperty('transition', 'none', 'important');
  }
}

function shapeFromElement(
  element: Element,
  rect: DOMRect,
  frameRect: DOMRect,
  decoration?: ReturnType<typeof decorationFromStyle>,
): NativeSceneElement | undefined {
  const style = getComputedStyle(element);
  const fill = resolveCssColor(style.backgroundColor);
  const borderWidth = Number.parseFloat(style.borderTopWidth);
  const lineColor = resolveCssColor(style.borderTopColor);
  const uniformBorder = isUniformBorder(style);
  const hasLine =
    uniformBorder &&
    Number.isFinite(borderWidth) &&
    borderWidth > 0 &&
    style.borderTopStyle !== 'none' &&
    lineColor !== undefined;
  const opacity = Number.parseFloat(style.opacity);
  const visibleFill = fill ? combineOpacity(fill, opacity) : undefined;
  const visibleLine = lineColor ? combineOpacity(lineColor, opacity) : undefined;
  const hasVisibleFill = visibleFill !== undefined && visibleFill.transparency < 100;
  const hasVisibleLine = hasLine && visibleLine !== undefined && visibleLine.transparency < 100;
  const gradient = decoration?.gradient;
  const shadow = decoration?.shadow;
  const borders = !uniformBorder ? sideBordersFromStyle(style, opacity) : undefined;
  if (!hasVisibleFill && !hasVisibleLine && !gradient && !shadow && !borders) return undefined;

  const radii = cornerRadii(style);
  const radius = radii.tl;
  return {
    kind: 'shape',
    bounds: relativeBounds(rect, frameRect),
    fill: hasVisibleFill ? visibleFill : undefined,
    gradient,
    line: hasVisibleLine
      ? {
          ...visibleLine,
          width: Math.max(0.25, borderWidth * PX_TO_PT),
        }
      : undefined,
    radius,
    radii:
      radii.tl !== radii.tr || radii.tr !== radii.br || radii.br !== radii.bl ? radii : undefined,
    shadow,
    borders,
  };
}

function shapeExtrasFromElement(
  style: CSSStyleDeclaration,
  profile: NativeSceneProfile = 'powerpoint',
): Partial<Extract<NativeSceneElement, { kind: 'text' }>> {
  const fill = resolveCssColor(style.backgroundColor);
  const opacity = Number.parseFloat(style.opacity);
  const visibleFill = fill ? combineOpacity(fill, opacity) : undefined;
  const hasVisibleFill = visibleFill !== undefined && visibleFill.transparency < 100;
  const decoration = decorationFromStyle(style, profile);
  const uniformBorder = isUniformBorder(style);
  const borderWidth = Number.parseFloat(style.borderTopWidth);
  const lineColor = resolveCssColor(style.borderTopColor);
  const hasLine =
    uniformBorder &&
    Number.isFinite(borderWidth) &&
    borderWidth > 0 &&
    style.borderTopStyle !== 'none' &&
    lineColor !== undefined;
  const visibleLine = lineColor ? combineOpacity(lineColor, opacity) : undefined;
  const extras: Partial<Extract<NativeSceneElement, { kind: 'text' }>> = {};
  if (hasVisibleFill) extras.fill = visibleFill;
  if (decoration?.gradient) extras.gradient = decoration.gradient;
  if (decoration?.shadow) extras.shadow = decoration.shadow;
  if (hasLine && visibleLine && visibleLine.transparency < 100) {
    extras.line = { ...visibleLine, width: Math.max(0.25, borderWidth * PX_TO_PT) };
  }
  if (!uniformBorder) {
    const borders = sideBordersFromStyle(style, opacity);
    if (borders) extras.borders = borders;
  }
  const radius = Number.parseFloat(style.borderTopLeftRadius) || 0;
  if (radius > 0) extras.radius = radius;
  return extras;
}

function isTextBlockRoot(element: Element, style: CSSStyleDeclaration): boolean {
  if (!(element instanceof HTMLElement)) return false;
  if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') return false;
  if (!hasOwnOrInlineText(element)) return false;
  if (isInlineDisplay(style) && INLINE_TAGS.has(element.tagName)) {
    const parent = element.parentElement;
    if (parent && hasOwnOrInlineText(parent)) return false;
  }
  for (const child of element.children) {
    if (!(child instanceof HTMLElement)) continue;
    const childStyle = getComputedStyle(child);
    if (
      !isInlineDisplay(childStyle) &&
      !INLINE_TAGS.has(child.tagName) &&
      hasOwnOrInlineText(child)
    ) {
      return false;
    }
  }
  return true;
}

function hasOwnOrInlineText(element: Element): boolean {
  for (const node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE && (node.textContent ?? '').trim()) return true;
    if (!(node instanceof Element)) continue;
    if (node.tagName === 'BR') return true;
    if (INLINE_TAGS.has(node.tagName) || isInlineDisplay(getComputedStyle(node))) {
      if (hasOwnOrInlineText(node)) return true;
    }
  }
  return false;
}

function isInlineDisplay(style: CSSStyleDeclaration): boolean {
  return (
    style.display === 'inline' ||
    style.display === 'inline-block' ||
    style.display === 'inline-flex' ||
    style.display === 'inline-grid' ||
    style.display === 'contents'
  );
}

function textFromBlock(
  element: HTMLElement,
  style: CSSStyleDeclaration,
  rect: DOMRect,
  frameRect: DOMRect,
  profile: NativeSceneProfile,
): Extract<NativeSceneElement, { kind: 'text' }> | undefined {
  const paragraphs = collectParagraphs(element, style);
  if (paragraphs.length === 0 || paragraphs.every((p) => p.runs.every((r) => !r.text))) {
    return undefined;
  }
  const fontSizePx = Number.parseFloat(style.fontSize);
  const textRange = document.createRange();
  textRange.selectNodeContents(element);
  const textRect = textRange.getBoundingClientRect();
  const bounds =
    profile === 'google-slides'
      ? googleSlidesTextBounds(
          textRect.width > 0 ? textRect : rect,
          rect,
          frameRect,
          style.textAlign,
          fontSizePx,
        )
      : relativeBounds(rect, frameRect);
  const insets = paddingInsetsFromStyle(style);
  return {
    kind: 'text',
    bounds,
    paragraphs,
    valign: inferTextValign(textRect.width > 0 ? textRect : rect, rect, style),
    wrapMode: 'reflow',
    ...(insets ? { insets } : {}),
  };
}

/** Read non-zero CSS padding from a text-block root (avoids double-counting parent padding on children). */
export function paddingInsetsFromStyle(
  style: CSSStyleDeclaration,
): { left: number; top: number; right: number; bottom: number } | undefined {
  const left = Number.parseFloat(style.paddingLeft) || 0;
  const top = Number.parseFloat(style.paddingTop) || 0;
  const right = Number.parseFloat(style.paddingRight) || 0;
  const bottom = Number.parseFloat(style.paddingBottom) || 0;
  if (left <= 0 && top <= 0 && right <= 0 && bottom <= 0) return undefined;
  return { left, top, right, bottom };
}

function collectParagraphs(element: HTMLElement, rootStyle: CSSStyleDeclaration): TextParagraph[] {
  const paragraphs: TextParagraph[] = [];
  let current: TextRun[] = [];
  const align = inferTextAlign(rootStyle);
  const lineHeight = Number.parseFloat(rootStyle.lineHeight);
  const fontSizePx = Number.parseFloat(rootStyle.fontSize);
  const lineSpacing =
    Number.isFinite(lineHeight) && Number.isFinite(fontSizePx) && fontSizePx > 0
      ? lineHeight * PX_TO_PT
      : undefined;

  const flush = () => {
    if (current.length === 0) return;
    const merged = mergeAdjacentRuns(current);
    if (merged.some((run) => run.text)) {
      paragraphs.push({ runs: merged, align, lineSpacing });
    }
    current = [];
  };

  const walk = (node: Node, inherited: CSSStyleDeclaration) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const raw = node.textContent ?? '';
      const text = applyTextTransform(
        normalizeText(raw, inherited.whiteSpace),
        inherited.textTransform,
      );
      if (!text) return;
      current.push(runFromStyle(text, inherited));
      return;
    }
    if (!(node instanceof HTMLElement)) return;
    if (node.tagName === 'BR') {
      flush();
      return;
    }
    const style = getComputedStyle(node);
    if (!isInlineDisplay(style) && !INLINE_TAGS.has(node.tagName)) {
      flush();
      for (const child of node.childNodes) walk(child, style);
      flush();
      return;
    }
    for (const child of node.childNodes) walk(child, style);
  };

  for (const child of element.childNodes) walk(child, rootStyle);
  flush();
  return paragraphs;
}

function runFromStyle(text: string, style: CSSStyleDeclaration): TextRun {
  const color = combineOpacity(
    resolveCssColor(style.color) ?? { color: '000000', transparency: 0 },
    Number.parseFloat(style.opacity),
  );
  const weight = Number.parseInt(style.fontWeight, 10);
  const letterSpacing = Number.parseFloat(style.letterSpacing);
  const fontSizePx = Number.parseFloat(style.fontSize);
  return {
    text,
    color,
    fontFace: style.fontFamily.split(',')[0]?.replace(/['"]/g, '').trim() || 'Arial',
    fontSize: Math.max(1, fontSizePx * PX_TO_PT),
    bold: Number.isFinite(weight) ? weight >= 600 : style.fontWeight === 'bold',
    italic: style.fontStyle === 'italic' || style.fontStyle === 'oblique',
    underline: style.textDecorationLine?.includes('underline') || undefined,
    charSpacing: Number.isFinite(letterSpacing) ? letterSpacing * PX_TO_PT : undefined,
  };
}

function mergeAdjacentRuns(runs: TextRun[]): TextRun[] {
  const merged: TextRun[] = [];
  for (const run of runs) {
    const previous = merged[merged.length - 1];
    if (
      previous &&
      previous.fontFace === run.fontFace &&
      previous.fontSize === run.fontSize &&
      previous.bold === run.bold &&
      previous.italic === run.italic &&
      previous.underline === run.underline &&
      previous.charSpacing === run.charSpacing &&
      previous.color.color === run.color.color &&
      previous.color.transparency === run.color.transparency
    ) {
      previous.text += run.text;
    } else {
      merged.push({ ...run });
    }
  }
  return merged;
}

function markConsumed(element: Element, consumed: WeakSet<Element>): void {
  consumed.add(element);
  for (const child of element.querySelectorAll('*')) consumed.add(child);
}

function markTextDescendantsConsumed(element: Element, consumed: WeakSet<Element>): void {
  for (const child of element.querySelectorAll('*')) {
    if (INLINE_TAGS.has(child.tagName) || isInlineDisplay(getComputedStyle(child))) {
      consumed.add(child);
    }
  }
}

async function rasterize(
  element: Element,
  rect: DOMRect,
  frameRect: DOMRect,
  decorationOnly: boolean,
  pixelRatio: number,
  reason: string,
): Promise<NativeSceneElement> {
  const { toPng } = await import('html-to-image');
  const data = await toPng(element as HTMLElement, {
    width: Math.max(1, Math.ceil(rect.width)),
    height: Math.max(1, Math.ceil(rect.height)),
    pixelRatio,
    cacheBust: false,
    filter: decorationOnly ? (node) => node === element : undefined,
  });
  return { kind: 'raster', bounds: relativeBounds(rect, frameRect), data, reason };
}

async function sourceToDataUri(source: string): Promise<string | undefined> {
  if (!source) return undefined;
  if (source.startsWith('data:')) return source;
  try {
    const response = await fetch(source);
    if (!response.ok) return undefined;
    return await blobToDataUri(await response.blob());
  } catch {
    return undefined;
  }
}

function blobToDataUri(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

async function dataUriToText(dataUri: string): Promise<string | undefined> {
  try {
    const response = await fetch(dataUri);
    return await response.text();
  } catch {
    return undefined;
  }
}

async function serializeSvg(element: SVGSVGElement): Promise<string | undefined> {
  try {
    const clone = element.cloneNode(true) as SVGSVGElement;
    if (!clone.getAttribute('xmlns')) {
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }
    return new XMLSerializer().serializeToString(clone);
  } catch {
    return undefined;
  }
}

async function svgToPngDataUri(
  svg: string,
  width: number,
  height: number,
): Promise<string | undefined> {
  if (typeof document === 'undefined') return undefined;
  const w = Math.max(1, Math.ceil(width));
  const h = Math.max(1, Math.ceil(height));
  try {
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    try {
      const image = await loadHtmlImage(url);
      const canvas = document.createElement('canvas');
      canvas.width = w * 2;
      canvas.height = h * 2;
      const context = canvas.getContext('2d');
      if (!context) return undefined;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/png');
    } finally {
      URL.revokeObjectURL(url);
    }
  } catch {
    return undefined;
  }
}

async function rasterizeToPngDataUri(element: Element, rect: DOMRect): Promise<string | undefined> {
  try {
    const { toPng } = await import('html-to-image');
    return await toPng(element as HTMLElement, {
      width: Math.max(1, Math.ceil(rect.width)),
      height: Math.max(1, Math.ceil(rect.height)),
      pixelRatio: 2,
      cacheBust: false,
    });
  } catch {
    return undefined;
  }
}

function loadHtmlImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to load image'));
    image.src = url;
  });
}

function hasUnsupportedDecoration(
  style: CSSStyleDeclaration,
  profile: NativeSceneProfile,
): boolean {
  if (style.filter !== 'none') return true;
  if (style.maskImage !== undefined && style.maskImage !== 'none') return true;
  if (style.backgroundImage !== 'none') {
    if (profile === 'powerpoint' && parseGradient(style.backgroundImage)) return false;
    return true;
  }
  if (style.boxShadow !== 'none') {
    if (profile === 'powerpoint' && parseBoxShadow(style.boxShadow)) return false;
    return true;
  }
  return false;
}

function decorationFromStyle(
  style: CSSStyleDeclaration,
  profile: NativeSceneProfile,
): { gradient?: GradientFill; shadow?: Shadow } | undefined {
  if (profile !== 'powerpoint') return undefined;
  const gradient =
    style.backgroundImage !== 'none' ? parseGradient(style.backgroundImage) : undefined;
  const shadow = style.boxShadow !== 'none' ? parseBoxShadow(style.boxShadow) : undefined;
  if (!gradient && !shadow) return undefined;
  return { gradient, shadow };
}

export function parseGradient(value: string): GradientFill | undefined {
  const linear = value.match(/^linear-gradient\((.+)\)$/i);
  if (linear) {
    const parts = splitCssList(linear[1]);
    if (parts.length < 2) return undefined;
    let angle = 180;
    let start = 0;
    const anglePart = parts[0].trim();
    const angleMatch = anglePart.match(/^(-?[\d.]+)deg$/i);
    if (angleMatch) {
      angle = Number.parseFloat(angleMatch[1]);
      start = 1;
    } else if (anglePart.startsWith('to ')) {
      angle = directionToAngle(anglePart.slice(3));
      start = 1;
    }
    const stops = parseGradientStops(parts.slice(start));
    if (stops.length < 2) return undefined;
    return { kind: 'linear', angle, stops };
  }

  const radial = value.match(/^radial-gradient\((.+)\)$/i);
  if (radial) {
    const parts = splitCssList(radial[1]);
    const stopParts = parts.filter((part) => !/^(circle|ellipse|at)\b/i.test(part.trim()));
    const stops = parseGradientStops(stopParts.length > 0 ? stopParts : parts);
    if (stops.length < 2) return undefined;
    return { kind: 'radial', stops };
  }
  return undefined;
}

const CSS_LENGTH_UNITS = new Set([
  'px',
  'em',
  'rem',
  'pt',
  'pc',
  'cm',
  'mm',
  'in',
  'q',
  'vh',
  'vw',
  'vmin',
  'vmax',
  'ex',
  'ch',
  'fr',
]);

export function parseBoxShadow(value: string): Shadow | undefined {
  if (!value || value === 'none') return undefined;
  // Chromium computed style is color-first ("rgba(...) 0px 2px 4px 0px") and may
  // include multiple layers. Prefer the most visible outer shadow (largest blur).
  let best: Shadow | undefined;
  for (const layer of splitCssList(value)) {
    const parsed = parseBoxShadowLayer(layer.trim());
    if (!parsed || parsed.inset) continue;
    if (!best || shadowVisualWeight(parsed) > shadowVisualWeight(best)) best = parsed;
  }
  return best;
}

function shadowVisualWeight(shadow: Shadow): number {
  const alpha = 1 - shadow.color.transparency / 100;
  return shadow.blur * alpha + Math.hypot(shadow.offsetX, shadow.offsetY) * 0.25 * alpha;
}

function parseBoxShadowLayer(layer: string): Shadow | undefined {
  if (!layer || layer === 'none') return undefined;
  const inset = /\binset\b/.test(layer);
  const funcColor = layer.match(/rgba?\([^)]+\)|hsla?\([^)]+\)|#[\da-fA-F]{3,8}\b/i);
  let colorRaw = funcColor?.[0];
  let rest = layer;
  if (colorRaw) {
    rest = layer.replace(colorRaw, ' ');
  }
  rest = rest.replace(/\binset\b/gi, ' ').trim();
  if (!colorRaw) {
    const tokens = rest.split(/\s+/).filter(Boolean);
    const namedIndex = tokens.findIndex(
      (token) => /^[a-z]+$/i.test(token) && !CSS_LENGTH_UNITS.has(token.toLowerCase()),
    );
    if (namedIndex < 0) return undefined;
    colorRaw = tokens[namedIndex];
    tokens.splice(namedIndex, 1);
    rest = tokens.join(' ');
  }
  const color = resolveCssColor(colorRaw);
  if (!color) return undefined;
  const nums = rest
    .split(/\s+/)
    .map((part) => Number.parseFloat(part))
    .filter((n) => Number.isFinite(n));
  return {
    color,
    offsetX: nums[0] ?? 0,
    offsetY: nums[1] ?? 0,
    blur: nums[2] ?? 0,
    spread: nums[3] ?? 0,
    inset,
  };
}

function parseGradientStops(parts: string[]): GradientStop[] {
  const stops: GradientStop[] = [];
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    const match = part.match(/^(.*?)\s+([\d.]+)%$/);
    const colorValue = match ? match[1] : part;
    const color = resolveCssColor(colorValue);
    if (!color) continue;
    const offset = match
      ? Number.parseFloat(match[2]) / 100
      : parts.length === 1
        ? 0
        : i / (parts.length - 1);
    stops.push({ offset, color });
  }
  return stops;
}

function splitCssList(value: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (const char of value) {
    if (char === '(') depth++;
    if (char === ')') depth = Math.max(0, depth - 1);
    if (char === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

function directionToAngle(direction: string): number {
  const tokens = new Set(direction.trim().toLowerCase().split(/\s+/));
  if (tokens.has('top') && tokens.has('right')) return 45;
  if (tokens.has('top') && tokens.has('left')) return 315;
  if (tokens.has('bottom') && tokens.has('right')) return 135;
  if (tokens.has('bottom') && tokens.has('left')) return 225;
  if (tokens.has('top')) return 0;
  if (tokens.has('right')) return 90;
  if (tokens.has('left')) return 270;
  return 180;
}

function isUniformBorder(style: CSSStyleDeclaration): boolean {
  return (
    style.borderTopWidth === style.borderRightWidth &&
    style.borderRightWidth === style.borderBottomWidth &&
    style.borderBottomWidth === style.borderLeftWidth &&
    style.borderTopStyle === style.borderRightStyle &&
    style.borderRightStyle === style.borderBottomStyle &&
    style.borderBottomStyle === style.borderLeftStyle &&
    style.borderTopColor === style.borderRightColor &&
    style.borderRightColor === style.borderBottomColor &&
    style.borderBottomColor === style.borderLeftColor
  );
}

function sideBordersFromStyle(
  style: CSSStyleDeclaration,
  opacity: number,
): SideBorders | undefined {
  const borders: SideBorders = {};
  const sides = [
    ['top', style.borderTopWidth, style.borderTopStyle, style.borderTopColor],
    ['right', style.borderRightWidth, style.borderRightStyle, style.borderRightColor],
    ['bottom', style.borderBottomWidth, style.borderBottomStyle, style.borderBottomColor],
    ['left', style.borderLeftWidth, style.borderLeftStyle, style.borderLeftColor],
  ] as const;
  for (const [side, widthValue, borderStyle, colorValue] of sides) {
    const width = Number.parseFloat(widthValue);
    const color = resolveCssColor(colorValue);
    if (!Number.isFinite(width) || width <= 0 || borderStyle === 'none' || !color) continue;
    const visible = combineOpacity(color, opacity);
    if (visible.transparency >= 100) continue;
    borders[side] = { color: visible, width: Math.max(0.25, width * PX_TO_PT) };
  }
  return Object.keys(borders).length > 0 ? borders : undefined;
}

function cornerRadii(style: CSSStyleDeclaration): {
  tl: number;
  tr: number;
  br: number;
  bl: number;
} {
  return {
    tl: Number.parseFloat(style.borderTopLeftRadius) || 0,
    tr: Number.parseFloat(style.borderTopRightRadius) || 0,
    br: Number.parseFloat(style.borderBottomRightRadius) || 0,
    bl: Number.parseFloat(style.borderBottomLeftRadius) || 0,
  };
}

function hasVisiblePseudoElement(element: Element): boolean {
  return ['::before', '::after'].some((pseudo) => {
    const style = getComputedStyle(element, pseudo);
    return style.content !== 'none' && style.content !== 'normal' && style.display !== 'none';
  });
}

function clipsDescendants(
  element: Element,
  style: CSSStyleDeclaration,
  rect: DOMRect,
  frameRect: DOMRect,
): boolean {
  if (element.children.length === 0) return false;
  const clips =
    style.overflow === 'hidden' ||
    style.overflow === 'clip' ||
    style.overflowX === 'hidden' ||
    style.overflowX === 'clip' ||
    style.overflowY === 'hidden' ||
    style.overflowY === 'clip';
  if (!clips) return false;
  // Page roots commonly use overflow:hidden as a canvas clip. Walk children
  // instead of rasterizing the whole slide when the element fills the frame.
  if (nearlyCoversFrame(rect, frameRect)) return false;
  return true;
}

function nearlyCoversFrame(rect: DOMRect, frameRect: DOMRect, slop = 2): boolean {
  return (
    rect.left <= frameRect.left + slop &&
    rect.top <= frameRect.top + slop &&
    rect.right >= frameRect.right - slop &&
    rect.bottom >= frameRect.bottom - slop
  );
}

function coversFrame(rect: DOMRect, frameRect: DOMRect): boolean {
  return nearlyCoversFrame(rect, frameRect, 0.5);
}

function sortedChildren(element: Element): Element[] {
  return Array.from(element.children)
    .map((child, index) => ({
      child,
      index,
      z: Number.parseInt(getComputedStyle(child).zIndex, 10) || 0,
    }))
    .sort((a, b) => a.z - b.z || a.index - b.index)
    .map(({ child }) => child);
}

function isVisible(style: CSSStyleDeclaration, rect: DOMRect, frameRect: DOMRect): boolean {
  if (style.display === 'none' || style.visibility === 'hidden') return false;
  if (Number.parseFloat(style.opacity) <= 0 || rect.width <= 0 || rect.height <= 0) return false;
  return !(
    rect.right <= frameRect.left ||
    rect.bottom <= frameRect.top ||
    rect.left >= frameRect.right ||
    rect.top >= frameRect.bottom
  );
}

function normalizeText(text: string, whiteSpace: string): string {
  if (whiteSpace.startsWith('pre')) return text;
  return text.replace(/\s+/g, ' ');
}

function combineOpacity(color: SceneColor, opacity: number): SceneColor {
  const safeOpacity = Number.isFinite(opacity) ? clamp(opacity, 0, 1) : 1;
  return {
    color: color.color,
    transparency: 100 - (100 - color.transparency) * safeOpacity,
  };
}

function opacityToTransparency(value: string): number {
  const opacity = Number.parseFloat(value);
  return 100 - clamp(Number.isFinite(opacity) ? opacity : 1, 0, 1) * 100;
}

function imageFit(value: string): 'contain' | 'cover' | 'fill' {
  if (value === 'contain' || value === 'cover') return value;
  return 'fill';
}

function textAlign(value: string): TextAlign {
  if (value === 'center' || value === 'right' || value === 'justify') return value;
  return 'left';
}

export function inferTextAlign(
  style: Pick<
    CSSStyleDeclaration,
    'alignItems' | 'display' | 'flexDirection' | 'justifyContent' | 'justifyItems' | 'textAlign'
  >,
  textRect?: Pick<DOMRect, 'left' | 'right'>,
  containerRect?: Pick<DOMRect, 'left' | 'right' | 'width'>,
): TextAlign {
  if (
    style.textAlign === 'left' ||
    style.textAlign === 'center' ||
    style.textAlign === 'right' ||
    style.textAlign === 'justify'
  ) {
    return textAlign(style.textAlign);
  }
  if (style.display.includes('flex')) {
    const horizontalControl = style.flexDirection.startsWith('column')
      ? style.alignItems
      : style.justifyContent;
    if (horizontalControl === 'center') return 'center';
    if (horizontalControl === 'flex-end' || horizontalControl === 'end') return 'right';
  }
  if (style.display.includes('grid')) {
    if (style.justifyItems === 'center') return 'center';
    if (style.justifyItems === 'flex-end' || style.justifyItems === 'end') return 'right';
  }
  if (style.display.startsWith('inline') && textRect && containerRect) {
    const leftGap = Math.max(0, textRect.left - containerRect.left);
    const rightGap = Math.max(0, containerRect.right - textRect.right);
    const tolerance = Math.max(2, containerRect.width * 0.08);
    if (Math.abs(leftGap - rightGap) <= tolerance && (leftGap > 0 || rightGap > 0)) return 'center';
    if (rightGap + tolerance < leftGap) return 'right';
  }
  return textAlign(style.textAlign);
}

export function inferTextValign(
  textRect: Pick<DOMRect, 'bottom' | 'top'>,
  containerRect: Pick<DOMRect, 'bottom' | 'height' | 'top'>,
  style: Pick<CSSStyleDeclaration, 'alignItems' | 'display' | 'flexDirection' | 'justifyContent'>,
): TextValign {
  if (style.display.includes('flex')) {
    const verticalControl = style.flexDirection.startsWith('column')
      ? style.justifyContent
      : style.alignItems;
    if (verticalControl === 'center') return 'middle';
    if (verticalControl === 'flex-end' || verticalControl === 'end') return 'bottom';
    if (verticalControl === 'flex-start' || verticalControl === 'start') return 'top';
  } else if (style.display.includes('grid')) {
    const gridAlignment = verticalAlign(style.alignItems);
    if (gridAlignment !== 'top' || style.alignItems === 'start') return gridAlignment;
  }

  const topGap = Math.max(0, textRect.top - containerRect.top);
  const bottomGap = Math.max(0, containerRect.bottom - textRect.bottom);
  const tolerance = Math.max(2, containerRect.height * 0.12);
  if (Math.abs(topGap - bottomGap) <= tolerance) return 'middle';
  if (bottomGap + tolerance < topGap) return 'bottom';
  return 'top';
}

function verticalAlign(value: string): TextValign {
  if (value === 'center') return 'middle';
  if (value === 'flex-end' || value === 'end') return 'bottom';
  return 'top';
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function nextPaint(): Promise<void> {
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      resolve();
    };
    requestAnimationFrame(finish);
    setTimeout(finish, 50);
  });
}
