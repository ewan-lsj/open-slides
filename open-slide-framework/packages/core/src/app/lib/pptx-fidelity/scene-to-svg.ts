import {
  flattenTextElement,
  NATIVE_SCENE_H,
  NATIVE_SCENE_W,
  type NativeSceneElement,
  type NativeSlideScene,
} from '../export-native-scene';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function colorCss(color: { color: string; transparency: number }): string {
  const alpha = Math.max(0, Math.min(1, 1 - color.transparency / 100));
  const r = Number.parseInt(color.color.slice(0, 2), 16);
  const g = Number.parseInt(color.color.slice(2, 4), 16);
  const b = Number.parseInt(color.color.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function elementSvg(element: NativeSceneElement, index: number): string {
  const { x, y, w, h } = element.bounds;
  if (element.kind === 'shape') {
    const fill = element.fill ? colorCss(element.fill) : 'none';
    const stroke = element.line ? colorCss(element.line) : 'none';
    const strokeWidth = element.line?.width ?? 0;
    const radius = element.radius ?? 0;
    return `<rect data-index="${index}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
  }
  if (element.kind === 'text') {
    const flat = flattenTextElement(element);
    const fill = colorCss(flat.color);
    const insetL = element.insets?.left ?? 0;
    const insetT = element.insets?.top ?? 0;
    const insetR = element.insets?.right ?? 0;
    const contentX = x + insetL;
    const contentW = Math.max(0, w - insetL - insetR);
    const anchor = flat.align === 'center' ? 'middle' : flat.align === 'right' ? 'end' : 'start';
    const textX =
      flat.align === 'center'
        ? contentX + contentW / 2
        : flat.align === 'right'
          ? contentX + contentW
          : contentX;
    const textY = y + insetT + flat.fontSize * 1.1;
    return `<text data-index="${index}" x="${textX}" y="${textY}" fill="${fill}" font-family="${escapeXml(flat.fontFace)}" font-size="${flat.fontSize}" font-weight="${flat.bold ? 700 : 400}" font-style="${flat.italic ? 'italic' : 'normal'}" text-anchor="${anchor}">${escapeXml(flat.text)}</text>`;
  }
  if (element.kind === 'image' || element.kind === 'raster') {
    return `<image data-index="${index}" href="${element.data}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="none"/>`;
  }
  if (element.kind === 'svg') {
    return `<image data-index="${index}" href="data:image/svg+xml;utf8,${encodeURIComponent(element.svg)}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="none"/>`;
  }
  return '';
}

export function sceneToSvg(scene: NativeSlideScene): string {
  const background = scene.background
    ? `<rect width="100%" height="100%" fill="${colorCss(scene.background)}"/>`
    : '<rect width="100%" height="100%" fill="#ffffff"/>';
  const body = scene.elements.map((element, index) => elementSvg(element, index)).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${NATIVE_SCENE_W}" height="${NATIVE_SCENE_H}" viewBox="0 0 ${NATIVE_SCENE_W} ${NATIVE_SCENE_H}">${background}${body}</svg>`;
}
