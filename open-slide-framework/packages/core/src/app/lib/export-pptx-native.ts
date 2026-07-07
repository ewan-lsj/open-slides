import PptxGenJS from 'pptxgenjs';
import { createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { designToCssVars } from './design';
import type { PptxExportProgress } from './export-pptx';
import { SlidePageProvider } from './page-context';
import { isFrameAnimationSettled, waitForDataWaitfor, waitForFonts } from './print-ready';
import type { SlideModule } from './sdk';

const SLIDE_W = 1920;
const SLIDE_H = 1080;
const SLIDE_W_IN = 13.333;
const PX_TO_IN = SLIDE_W_IN / SLIDE_W;
const PX_TO_PT = PX_TO_IN * 72;
const ANIMATION_TIMEOUT_MS = 15_000;
const POLL_INTERVAL_MS = 100;
const CAPTURE_CLASS = 'os-native-pptx-capture';
const CAPTURE_STYLE_ID = 'os-native-pptx-capture-style';
const ATOMIC_RASTER_TAGS = new Set(['CANVAS', 'IFRAME', 'OBJECT', 'SVG', 'VIDEO']);
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

type Bounds = { x: number; y: number; w: number; h: number };
type Color = { color: string; transparency: number };

export type NativeSceneElement =
  | {
      kind: 'shape';
      bounds: Bounds;
      fill?: Color;
      line?: Color & { width: number };
      radius: number;
    }
  | {
      kind: 'text';
      bounds: Bounds;
      text: string;
      color: Color;
      fontFace: string;
      fontSize: number;
      bold: boolean;
      italic: boolean;
      align: 'left' | 'center' | 'right' | 'justify';
      valign: 'top' | 'middle' | 'bottom';
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
      kind: 'raster';
      bounds: Bounds;
      data: string;
    };

export type NativeSlideScene = {
  elements: NativeSceneElement[];
  fallbackCount: number;
  background?: Color;
  notes?: string;
};

export async function exportSlideAsPptx(
  slide: SlideModule,
  slideId: string,
  onProgress?: (progress: PptxExportProgress) => void,
): Promise<void> {
  return exportSlideAsNativePptx(slide, slideId, onProgress);
}

export function resolveNativePptxFilename(slideId: string): string {
  return `${slideId}.pptx`;
}

export function googleSlidesFontFace(fontFace: string): string {
  const normalized = fontFace.trim().replace(/^['"]|['"]$/g, '');
  return GOOGLE_SLIDES_SAFE_FONTS.has(normalized.toLowerCase()) ? normalized : 'Arial';
}

async function exportSlideAsNativePptx(
  slide: SlideModule,
  slideId: string,
  onProgress?: (progress: PptxExportProgress) => void,
): Promise<void> {
  const pages = slide.default ?? [];
  if (pages.length === 0) return;

  const total = pages.length;
  let fallbackCount = 0;
  onProgress?.({ phase: 'processing', current: 0, total, percent: 0, fallbackCount });
  const capture = mountPages(slide);

  try {
    await waitUntilReady(capture.container, capture.frames);
    const scenes: NativeSlideScene[] = [];
    for (let i = 0; i < capture.frames.length; i++) {
      freezeForCapture(capture.frames[i]);
      const scene = await extractNativeSlideScene(capture.frames[i], slide.notes?.[i]);
      scenes.push(scene);
      fallbackCount += scene.fallbackCount;
      onProgress?.({
        phase: 'processing',
        current: i + 1,
        total,
        percent: Math.min(95, ((i + 1) / total) * 95),
        fallbackCount,
      });
    }

    onProgress?.({
      phase: 'generating',
      current: total,
      total,
      percent: 98,
      fallbackCount,
    });
    const blob = await buildNativePptx(scenes, slide.meta?.title ?? slideId);
    downloadBlob(blob, resolveNativePptxFilename(slideId));
    onProgress?.({
      phase: 'done',
      current: total,
      total,
      percent: 100,
      fallbackCount,
    });
  } finally {
    capture.dispose();
  }
}

export async function extractNativeSlideScene(
  frame: HTMLElement,
  notes?: string,
): Promise<NativeSlideScene> {
  const frameRect = frame.getBoundingClientRect();
  const elements: NativeSceneElement[] = [];
  let fallbackCount = 0;
  let background = resolveCssColor(getComputedStyle(frame).backgroundColor);

  if (hasUnsupportedDecoration(getComputedStyle(frame))) {
    elements.push(await rasterize(frame, frameRect, frameRect, true));
    fallbackCount++;
  }

  const visit = async (element: Element): Promise<void> => {
    if (!(element instanceof HTMLElement || element instanceof SVGElement)) return;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    if (!isVisible(style, rect, frameRect)) return;

    if (requiresAtomicRaster(element, style) || clipsDescendants(element, style, rect, frameRect)) {
      elements.push(await rasterize(element, rect, frameRect, false));
      fallbackCount++;
      return;
    }

    if (hasUnsupportedDecoration(style) || hasVisiblePseudoElement(element)) {
      elements.push(await rasterize(element, rect, frameRect, true));
      fallbackCount++;
    } else {
      const shape = shapeFromElement(element, rect, frameRect);
      if (
        shape?.kind === 'shape' &&
        shape.fill &&
        !shape.line &&
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
        elements.push({
          kind: 'image',
          bounds: relativeBounds(rect, frameRect),
          data,
          fit: imageFit(style.objectFit),
          transparency: opacityToTransparency(style.opacity),
          altText: element.alt || undefined,
        });
      } else {
        elements.push(await rasterize(element, rect, frameRect, false));
        fallbackCount++;
      }
      return;
    }

    for (const node of element.childNodes) {
      if (node.nodeType !== Node.TEXT_NODE) continue;
      const text = normalizeText(node.textContent ?? '', style.whiteSpace);
      if (!text) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      const textRect = range.getBoundingClientRect();
      if (textRect.width <= 0 || textRect.height <= 0) continue;
      elements.push(textFromNode(text, style, textRect, rect, frameRect));
    }

    for (const child of sortedChildren(element)) await visit(child);
  };

  for (const child of sortedChildren(frame)) await visit(child);
  return { elements, fallbackCount, background, notes };
}

export async function buildNativePptx(scenes: NativeSlideScene[], title: string): Promise<Blob> {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'open-slide';
  pptx.company = 'open-slide';
  pptx.subject = 'Editable Google Slides export';
  pptx.title = title;
  pptx.theme = {
    headFontFace: 'Arial',
    bodyFontFace: 'Arial',
  };

  for (const scene of scenes) {
    const slide = pptx.addSlide();
    slide.background = { color: scene.background?.color ?? 'FFFFFF' };
    for (const element of scene.elements) {
      const position = toPptxPosition(element.bounds);
      if (element.kind === 'shape') {
        const shapeType = element.radius > 0 ? pptx.ShapeType.roundRect : pptx.ShapeType.rect;
        slide.addShape(shapeType, {
          ...position,
          rectRadius: normalizedRadius(element.radius, element.bounds),
          fill: element.fill
            ? { color: element.fill.color, transparency: element.fill.transparency }
            : { color: 'FFFFFF', transparency: 100 },
          line: element.line
            ? {
                color: element.line.color,
                transparency: element.line.transparency,
                width: element.line.width,
              }
            : { color: 'FFFFFF', transparency: 100 },
        });
      } else if (element.kind === 'text') {
        slide.addText(element.text, {
          ...position,
          margin: 0,
          fit: 'shrink',
          breakLine: false,
          color: element.color.color,
          transparency: element.color.transparency,
          fontFace: googleSlidesFontFace(element.fontFace),
          fontSize: element.fontSize,
          bold: element.bold,
          italic: element.italic,
          align: element.align,
          valign: element.valign,
        });
      } else {
        slide.addImage({
          ...position,
          data: element.data,
          sizing:
            element.kind === 'image' && element.fit !== 'fill'
              ? { type: element.fit, w: position.w, h: position.h }
              : undefined,
          transparency: element.kind === 'image' ? element.transparency : 0,
          altText: element.kind === 'image' ? element.altText : 'Raster fallback',
        });
      }
    }
    if (scene.notes) slide.addNotes(scene.notes);
  }

  const output = await pptx.write({ outputType: 'blob', compression: true });
  if (!(output instanceof Blob)) throw new Error('PPTX generator did not return a Blob');
  return output;
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

export function parseCssColor(value: string): Color | undefined {
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
  return {
    color: channels
      .map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase(),
    transparency: (1 - clamp(alpha, 0, 1)) * 100,
  };
}

function resolveCssColor(value: string): Color | undefined {
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

function mountPages(slide: SlideModule): {
  container: HTMLElement;
  frames: HTMLElement[];
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
  const roots: Root[] = [];
  const frames: HTMLElement[] = [];
  for (let i = 0; i < slide.default.length; i++) {
    const Page = slide.default[i];
    if (!Page) continue;
    const frame = document.createElement('div');
    frame.setAttribute('data-osd-canvas', '');
    Object.assign(frame.style, {
      width: `${SLIDE_W}px`,
      height: `${SLIDE_H}px`,
      overflow: 'hidden',
      background: '#fff',
    });
    if (designVars) {
      for (const [key, value] of Object.entries(designVars)) frame.style.setProperty(key, value);
    }
    container.appendChild(frame);
    frames.push(frame);
    const root = createRoot(frame);
    root.render(
      createElement(
        SlidePageProvider,
        { index: i, total: slide.default.length },
        createElement(Page),
      ),
    );
    roots.push(root);
  }

  return {
    container,
    frames,
    dispose: () => {
      for (const root of roots) root.unmount();
      container.remove();
      captureStyle.remove();
    },
  };
}

async function waitUntilReady(container: HTMLElement, frames: HTMLElement[]): Promise<void> {
  await nextPaint();
  await waitForFonts();
  const deadline = performance.now() + ANIMATION_TIMEOUT_MS;
  while (performance.now() < deadline) {
    if (frames.every((frame) => isFrameAnimationSettled(frame))) break;
    await sleep(POLL_INTERVAL_MS);
  }
  await waitForDataWaitfor(container);
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
): NativeSceneElement | undefined {
  const style = getComputedStyle(element);
  const fill = resolveCssColor(style.backgroundColor);
  const borderWidth = Number.parseFloat(style.borderTopWidth);
  const lineColor = resolveCssColor(style.borderTopColor);
  const hasLine =
    Number.isFinite(borderWidth) &&
    borderWidth > 0 &&
    style.borderTopStyle !== 'none' &&
    lineColor !== undefined;
  if (!fill && !hasLine) return undefined;
  const opacity = Number.parseFloat(style.opacity);
  return {
    kind: 'shape',
    bounds: relativeBounds(rect, frameRect),
    fill: fill ? combineOpacity(fill, opacity) : undefined,
    line: hasLine
      ? { ...combineOpacity(lineColor, opacity), width: Math.max(0.25, borderWidth * PX_TO_PT) }
      : undefined,
    radius: Number.parseFloat(style.borderTopLeftRadius) || 0,
  };
}

function textFromNode(
  text: string,
  style: CSSStyleDeclaration,
  rect: DOMRect,
  containerRect: DOMRect,
  frameRect: DOMRect,
): NativeSceneElement {
  const color = combineOpacity(
    resolveCssColor(style.color) ?? { color: '000000', transparency: 0 },
    Number.parseFloat(style.opacity),
  );
  const weight = Number.parseInt(style.fontWeight, 10);
  const fontSizePx = Number.parseFloat(style.fontSize);
  const bounds = googleSlidesTextBounds(rect, containerRect, frameRect, style.textAlign, fontSizePx);
  return {
    kind: 'text',
    bounds,
    text,
    color,
    fontFace: style.fontFamily.split(',')[0]?.replace(/['"]/g, '').trim() || 'Arial',
    fontSize: Math.max(1, fontSizePx * PX_TO_PT),
    bold: Number.isFinite(weight) ? weight >= 600 : style.fontWeight === 'bold',
    italic: style.fontStyle === 'italic' || style.fontStyle === 'oblique',
    align: inferTextAlign(style, rect, containerRect),
    valign: inferTextValign(rect, containerRect, style),
  };
}

async function rasterize(
  element: Element,
  rect: DOMRect,
  frameRect: DOMRect,
  decorationOnly: boolean,
): Promise<NativeSceneElement> {
  const { toPng } = await import('html-to-image');
  const data = await toPng(element as HTMLElement, {
    width: Math.max(1, Math.ceil(rect.width)),
    height: Math.max(1, Math.ceil(rect.height)),
    pixelRatio: 2,
    cacheBust: true,
    filter: decorationOnly ? (node) => node === element : undefined,
  });
  return { kind: 'raster', bounds: relativeBounds(rect, frameRect), data };
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

function hasUnsupportedDecoration(style: CSSStyleDeclaration): boolean {
  return (
    style.backgroundImage !== 'none' ||
    style.boxShadow !== 'none' ||
    style.filter !== 'none' ||
    (style.maskImage !== undefined && style.maskImage !== 'none')
  );
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
  return !coversFrame(rect, frameRect);
}

function coversFrame(rect: DOMRect, frameRect: DOMRect): boolean {
  return (
    Math.abs(rect.left - frameRect.left) < 0.5 &&
    Math.abs(rect.top - frameRect.top) < 0.5 &&
    Math.abs(rect.width - frameRect.width) < 0.5 &&
    Math.abs(rect.height - frameRect.height) < 0.5
  );
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
  return text.replace(/\s+/g, ' ').trim();
}

function combineOpacity(color: Color, opacity: number): Color {
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

function normalizedRadius(radius: number, bounds: Bounds): number {
  const maximum = Math.min(bounds.w, bounds.h) / 2;
  return maximum > 0 ? clamp(radius / maximum, 0, 1) : 0;
}

function imageFit(value: string): 'contain' | 'cover' | 'fill' {
  if (value === 'contain' || value === 'cover') return value;
  return 'fill';
}

function textAlign(value: string): 'left' | 'center' | 'right' | 'justify' {
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
): 'left' | 'center' | 'right' | 'justify' {
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
): 'top' | 'middle' | 'bottom' {
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

function verticalAlign(value: string): 'top' | 'middle' | 'bottom' {
  if (value === 'center') return 'middle';
  if (value === 'flex-end' || value === 'end') return 'bottom';
  return 'top';
}

function toPptxPosition(bounds: Bounds): { x: number; y: number; w: number; h: number } {
  return {
    x: bounds.x * PX_TO_IN,
    y: bounds.y * PX_TO_IN,
    w: Math.max(0.001, bounds.w * PX_TO_IN),
    h: Math.max(0.001, bounds.h * PX_TO_IN),
  };
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
