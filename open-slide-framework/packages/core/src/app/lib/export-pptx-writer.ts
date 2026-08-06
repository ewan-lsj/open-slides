import { strToU8, zipSync } from 'fflate';
import {
  EMU_PER_PX,
  type GradientFill,
  NATIVE_SCENE_H,
  NATIVE_SCENE_W,
  type NativeSceneElement,
  type NativeSlideScene,
  type SceneColor,
  type Shadow,
  type SideBorders,
  type TextParagraph,
  type TextRun,
} from './export-native-scene';

const XML_DECL = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
const REL_NS = 'http://schemas.openxmlformats.org/package/2006/relationships';
const OD_REL = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const EMU_W = NATIVE_SCENE_W * EMU_PER_PX;
const EMU_H = NATIVE_SCENE_H * EMU_PER_PX;
const PT_TO_EMU = 12700;

export type PptxThemeFonts = {
  major?: string;
  minor?: string;
};

export type BuildPptxOptions = {
  title?: string;
  author?: string;
  fonts?: PptxThemeFonts;
};

type MediaEntry = {
  id: string;
  path: string;
  contentType: string;
  data: Uint8Array;
  hash: string;
};

type SlideBuild = {
  xml: string;
  rels: string[];
  notes?: string;
};

export function pxToEmu(px: number): number {
  return Math.round(px * EMU_PER_PX);
}

export function ptToHundredths(pt: number): number {
  return Math.max(1, Math.round(pt * 100));
}

export async function buildNativePptx(
  scenes: NativeSlideScene[],
  title: string,
  options: BuildPptxOptions = {},
): Promise<Blob> {
  const media = new MediaRegistry();
  const slides: SlideBuild[] = [];

  for (let i = 0; i < scenes.length; i++) {
    slides.push(buildSlide(scenes[i], i + 1, media));
  }

  const notesSlideIndexes = slides
    .map((slide, index) => (slide.notes ? index + 1 : -1))
    .filter((index) => index > 0);
  const files: Record<string, Uint8Array> = {};
  files['[Content_Types].xml'] = strToU8(
    contentTypesXml(slides.length, media.entries(), notesSlideIndexes),
  );
  files['_rels/.rels'] = strToU8(rootRelsXml());
  files['docProps/core.xml'] = strToU8(coreXml(title, options.author ?? 'open-slide'));
  files['docProps/app.xml'] = strToU8(appXml(slides.length));
  files['ppt/presentation.xml'] = strToU8(presentationXml(slides.length));
  files['ppt/_rels/presentation.xml.rels'] = strToU8(presentationRelsXml(slides.length));
  files['ppt/presProps.xml'] = strToU8(presPropsXml());
  files['ppt/viewProps.xml'] = strToU8(viewPropsXml());
  files['ppt/tableStyles.xml'] = strToU8(tableStylesXml());
  files['ppt/theme/theme1.xml'] = strToU8(
    themeXml(options.fonts?.major ?? 'Arial', options.fonts?.minor ?? 'Arial'),
  );
  files['ppt/slideMasters/slideMaster1.xml'] = strToU8(slideMasterXml());
  files['ppt/slideMasters/_rels/slideMaster1.xml.rels'] = strToU8(slideMasterRelsXml());
  files['ppt/slideLayouts/slideLayout1.xml'] = strToU8(slideLayoutXml());
  files['ppt/slideLayouts/_rels/slideLayout1.xml.rels'] = strToU8(slideLayoutRelsXml());

  for (let i = 0; i < slides.length; i++) {
    const idx = i + 1;
    const slide = slides[i];
    files[`ppt/slides/slide${idx}.xml`] = strToU8(slide.xml);
    const rels = [
      `<Relationship Id="rId1" Type="${OD_REL}/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>`,
      ...slide.rels,
    ];
    if (slide.notes) {
      const notesRId = `rId${rels.length + 1}`;
      rels.push(
        `<Relationship Id="${notesRId}" Type="${OD_REL}/notesSlide" Target="../notesSlides/notesSlide${idx}.xml"/>`,
      );
      files[`ppt/notesSlides/notesSlide${idx}.xml`] = strToU8(notesSlideXml(slide.notes, idx));
      files[`ppt/notesSlides/_rels/notesSlide${idx}.xml.rels`] = strToU8(notesSlideRelsXml(idx));
    }
    files[`ppt/slides/_rels/slide${idx}.xml.rels`] = strToU8(
      `${XML_DECL}<Relationships xmlns="${REL_NS}">${rels.join('')}</Relationships>`,
    );
  }

  if (notesSlideIndexes.length > 0) {
    files['ppt/notesMasters/notesMaster1.xml'] = strToU8(notesMasterXml());
    files['ppt/notesMasters/_rels/notesMaster1.xml.rels'] = strToU8(notesMasterRelsXml());
  }

  for (const entry of media.entries()) {
    files[entry.path] = entry.data;
  }

  const zipped = zipSync(files, { level: 6 });
  return new Blob([zipped as BlobPart], {
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  });
}

export function validatePptxPackage(files: Record<string, Uint8Array>): string[] {
  const errors: string[] = [];
  const paths = new Set(Object.keys(files));
  if (!paths.has('[Content_Types].xml')) errors.push('missing [Content_Types].xml');
  if (!paths.has('ppt/presentation.xml')) errors.push('missing ppt/presentation.xml');

  const contentTypes = decode(files['[Content_Types].xml'] ?? new Uint8Array());
  const presentation = decode(files['ppt/presentation.xml'] ?? new Uint8Array());
  const sldSz = presentation.match(/<p:sldSz cx="(\d+)" cy="(\d+)"/);
  if (!sldSz || sldSz[1] !== String(EMU_W) || sldSz[2] !== String(EMU_H)) {
    errors.push(`unexpected sldSz: expected ${EMU_W}x${EMU_H}`);
  }

  for (const path of paths) {
    if (!path.endsWith('.rels')) continue;
    const rels = decode(files[path]);
    const baseDir = path.includes('/') ? path.slice(0, path.lastIndexOf('/')) : '';
    const packageBase = baseDir.endsWith('_rels')
      ? baseDir.slice(0, -'_rels'.length).replace(/\/$/, '')
      : baseDir;
    for (const match of rels.matchAll(/Target="([^"]+)"/g)) {
      const target = match[1];
      if (target.startsWith('http')) continue;
      const resolved = resolveZipPath(packageBase, target);
      if (!paths.has(resolved))
        errors.push(`broken relationship ${path} -> ${target} (${resolved})`);
    }
  }

  for (const match of contentTypes.matchAll(/PartName="([^"]+)"/g)) {
    const part = match[1].replace(/^\//, '');
    if (!paths.has(part)) errors.push(`Content_Types references missing part ${part}`);
  }

  return errors;
}

class MediaRegistry {
  private byHash = new Map<string, MediaEntry>();
  private counter = 0;

  addDataUri(dataUri: string, preferredExt?: string): MediaEntry | undefined {
    const parsed = parseDataUri(dataUri);
    if (!parsed) return undefined;
    return this.addBytes(parsed.bytes, parsed.contentType, preferredExt ?? parsed.ext);
  }

  addBytes(bytes: Uint8Array, contentType: string, ext: string): MediaEntry {
    const hash = fnv1a(bytes);
    const existing = this.byHash.get(hash);
    if (existing) return existing;
    this.counter += 1;
    const id = `rMedia${this.counter}`;
    const path = `ppt/media/image${this.counter}.${ext}`;
    const entry: MediaEntry = { id, path, contentType, data: bytes, hash };
    this.byHash.set(hash, entry);
    return entry;
  }

  addSvg(svg: string, pngFallback?: string): { svg: MediaEntry; png?: MediaEntry } {
    const svgBytes = strToU8(svg);
    const svgEntry = this.addBytes(svgBytes, 'image/svg+xml', 'svg');
    const png = pngFallback ? this.addDataUri(pngFallback, 'png') : undefined;
    return { svg: svgEntry, png };
  }

  entries(): MediaEntry[] {
    return [...this.byHash.values()];
  }
}

function buildSlide(scene: NativeSlideScene, index: number, media: MediaRegistry): SlideBuild {
  const shapes: string[] = [];
  const rels: string[] = [];
  let shapeId = 2;

  const background = scene.background?.color ?? 'FFFFFF';

  for (const element of scene.elements) {
    if (element.kind === 'shape') {
      shapes.push(shapeXml(shapeId++, element));
      if (element.borders)
        shapes.push(...sideBorderShapes(shapeId, element.bounds, element.borders));
      shapeId += countSideBorders(element.borders);
    } else if (element.kind === 'text') {
      shapes.push(textShapeXml(shapeId++, element));
      if (element.borders)
        shapes.push(...sideBorderShapes(shapeId, element.bounds, element.borders));
      shapeId += countSideBorders(element.borders);
    } else if (element.kind === 'image' || element.kind === 'raster') {
      const entry = media.addDataUri(element.data);
      if (!entry) continue;
      const rid = `rId${rels.length + 2}`;
      rels.push(
        `<Relationship Id="${rid}" Type="${OD_REL}/image" Target="../media/${entry.path.split('/').pop()}"/>`,
      );
      shapes.push(
        pictureXml(
          shapeId++,
          element.bounds,
          rid,
          element.kind === 'image' ? element.altText : (element.reason ?? 'Raster fallback'),
          element.kind === 'image' ? element.transparency : 0,
          undefined,
        ),
      );
    } else if (element.kind === 'svg') {
      const { svg, png } = media.addSvg(element.svg, element.pngFallback);
      const svgRid = `rId${rels.length + 2}`;
      rels.push(
        `<Relationship Id="${svgRid}" Type="${OD_REL}/image" Target="../media/${svg.path.split('/').pop()}"/>`,
      );
      let pngRid: string | undefined;
      if (png) {
        pngRid = `rId${rels.length + 2}`;
        rels.push(
          `<Relationship Id="${pngRid}" Type="${OD_REL}/image" Target="../media/${png.path.split('/').pop()}"/>`,
        );
      }
      shapes.push(
        pictureXml(
          shapeId++,
          element.bounds,
          pngRid ?? svgRid,
          element.altText ?? 'SVG',
          element.transparency,
          pngRid ? svgRid : undefined,
        ),
      );
    }
  }

  const xml = `${XML_DECL}<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="${OD_REL}" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld name="Slide ${index}"><p:bg><p:bgPr><a:solidFill>${srgb(background)}</a:solidFill><a:effectLst/></p:bgPr></p:bg><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>${shapes.join('')}</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>`;

  return { xml, rels, notes: scene.notes };
}

function shapeXml(id: number, element: Extract<NativeSceneElement, { kind: 'shape' }>): string {
  return `<p:sp><p:nvSpPr><p:cNvPr id="${id}" name="Shape ${id}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr>${xfrm(element.bounds)}${geometryXml(element.radius, element.radii, element.bounds)}${fillXml(element.fill, element.gradient)}${lineXml(element.line)}${effectXml(element.shadow)}</p:spPr></p:sp>`;
}

function textShapeXml(id: number, element: Extract<NativeSceneElement, { kind: 'text' }>): string {
  const wrap = element.wrapMode === 'measured' ? 'none' : 'square';
  const anchor = element.valign === 'middle' ? 'ctr' : element.valign === 'bottom' ? 'b' : 't';
  const body = element.paragraphs.map((paragraph) => paragraphXml(paragraph)).join('');
  const lIns = Math.round((element.insets?.left ?? 0) * EMU_PER_PX);
  const tIns = Math.round((element.insets?.top ?? 0) * EMU_PER_PX);
  const rIns = Math.round((element.insets?.right ?? 0) * EMU_PER_PX);
  const bIns = Math.round((element.insets?.bottom ?? 0) * EMU_PER_PX);
  return `<p:sp><p:nvSpPr><p:cNvPr id="${id}" name="Text ${id}"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr><p:spPr>${xfrm(element.bounds)}${geometryXml(element.radius ?? 0, undefined, element.bounds)}${fillXml(element.fill, element.gradient)}${lineXml(element.line)}${effectXml(element.shadow)}</p:spPr><p:txBody><a:bodyPr wrap="${wrap}" lIns="${lIns}" tIns="${tIns}" rIns="${rIns}" bIns="${bIns}" rtlCol="0" anchor="${anchor}"/><a:lstStyle/>${body}</p:txBody></p:sp>`;
}

function paragraphXml(paragraph: TextParagraph): string {
  const algn =
    paragraph.align === 'center'
      ? 'ctr'
      : paragraph.align === 'right'
        ? 'r'
        : paragraph.align === 'justify'
          ? 'just'
          : 'l';
  const lnSpc = paragraph.lineSpacing
    ? `<a:lnSpc><a:spcPts val="${ptToHundredths(paragraph.lineSpacing)}"/></a:lnSpc>`
    : '';
  const runs =
    paragraph.runs.length > 0
      ? paragraph.runs.map((run) => runXml(run)).join('')
      : runXml({
          text: '',
          color: { color: '000000', transparency: 0 },
          fontFace: 'Arial',
          fontSize: 12,
          bold: false,
          italic: false,
        });
  return `<a:p><a:pPr algn="${algn}"${lnSpc ? '' : ''}>${lnSpc}<a:buNone/></a:pPr>${runs}<a:endParaRPr lang="en-US"/></a:p>`;
}

function runXml(run: TextRun): string {
  const solid = solidFillXml(run.color);
  const underline = run.underline ? ' u="sng"' : '';
  const spc = run.charSpacing !== undefined ? ` spc="${Math.round(run.charSpacing * 100)}"` : '';
  const face = escapeXml(run.fontFace || 'Arial');
  return `<a:r><a:rPr lang="en-US" sz="${ptToHundredths(run.fontSize)}"${run.bold ? ' b="1"' : ''}${run.italic ? ' i="1"' : ''}${underline}${spc} dirty="0">${solid}<a:latin typeface="${face}" pitchFamily="34" charset="0"/><a:ea typeface="${face}" pitchFamily="34" charset="-122"/><a:cs typeface="${face}" pitchFamily="34" charset="-120"/></a:rPr><a:t>${escapeXml(run.text)}</a:t></a:r>`;
}

function pictureXml(
  id: number,
  bounds: { x: number; y: number; w: number; h: number },
  embedRid: string,
  alt: string | undefined,
  transparency: number,
  svgRid?: string,
): string {
  const alpha =
    transparency > 0 ? `<a:alphaModFix amt="${Math.round((100 - transparency) * 1000)}"/>` : '';
  const svgExt = svgRid
    ? `<a:extLst><a:ext uri="{96DAC541-7B7A-43D3-8B79-37D633B846F1}"><asvg:svgBlip xmlns:asvg="http://schemas.microsoft.com/office/drawing/2016/SVG/main" r:embed="${svgRid}"/></a:ext></a:extLst>`
    : '';
  return `<p:pic><p:nvPicPr><p:cNvPr id="${id}" name="Image ${id}" descr="${escapeXml(alt ?? '')}"/><p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr><p:nvPr/></p:nvPicPr><p:blipFill><a:blip r:embed="${embedRid}">${alpha}${svgExt}</a:blip><a:stretch><a:fillRect/></a:stretch></p:blipFill><p:spPr>${xfrm(bounds)}<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr></p:pic>`;
}

function sideBorderShapes(
  startId: number,
  bounds: { x: number; y: number; w: number; h: number },
  borders: SideBorders,
): string[] {
  const shapes: string[] = [];
  let id = startId;
  const push = (
    side: 'top' | 'right' | 'bottom' | 'left',
    border: NonNullable<SideBorders[typeof side]>,
  ) => {
    const widthPx = border.width / 0.5;
    const rect =
      side === 'top'
        ? { x: bounds.x, y: bounds.y, w: bounds.w, h: widthPx }
        : side === 'bottom'
          ? { x: bounds.x, y: bounds.y + bounds.h - widthPx, w: bounds.w, h: widthPx }
          : side === 'left'
            ? { x: bounds.x, y: bounds.y, w: widthPx, h: bounds.h }
            : { x: bounds.x + bounds.w - widthPx, y: bounds.y, w: widthPx, h: bounds.h };
    shapes.push(
      `<p:sp><p:nvSpPr><p:cNvPr id="${id}" name="Border ${side}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr>${xfrm(rect)}<a:prstGeom prst="rect"><a:avLst/></a:prstGeom>${fillXml(border.color)}<a:ln><a:noFill/></a:ln></p:spPr></p:sp>`,
    );
    id++;
  };
  if (borders.top) push('top', borders.top);
  if (borders.right) push('right', borders.right);
  if (borders.bottom) push('bottom', borders.bottom);
  if (borders.left) push('left', borders.left);
  return shapes;
}

function countSideBorders(borders?: SideBorders): number {
  if (!borders) return 0;
  return [borders.top, borders.right, borders.bottom, borders.left].filter(Boolean).length;
}

function xfrm(bounds: { x: number; y: number; w: number; h: number }): string {
  return `<a:xfrm><a:off x="${pxToEmu(bounds.x)}" y="${pxToEmu(bounds.y)}"/><a:ext cx="${Math.max(1, pxToEmu(bounds.w))}" cy="${Math.max(1, pxToEmu(bounds.h))}"/></a:xfrm>`;
}

function geometryXml(
  radius: number,
  radii: { tl: number; tr: number; br: number; bl: number } | undefined,
  bounds: { w: number; h: number },
): string {
  if (radii && (radii.tl !== radii.tr || radii.tr !== radii.br || radii.br !== radii.bl)) {
    return customRoundRect(radii, bounds);
  }
  if (radius > 0) {
    const adj = Math.round(
      Math.min(1, (2 * radius) / Math.max(1, Math.min(bounds.w, bounds.h))) * 50000,
    );
    return `<a:prstGeom prst="roundRect"><a:avLst><a:gd name="adj" fmla="val ${adj}"/></a:avLst></a:prstGeom>`;
  }
  return `<a:prstGeom prst="rect"><a:avLst/></a:prstGeom>`;
}

function customRoundRect(
  radii: { tl: number; tr: number; br: number; bl: number },
  bounds: { w: number; h: number },
): string {
  const w = Math.max(1, bounds.w);
  const h = Math.max(1, bounds.h);
  const tl = Math.min(radii.tl, w / 2, h / 2);
  const tr = Math.min(radii.tr, w / 2, h / 2);
  const br = Math.min(radii.br, w / 2, h / 2);
  const bl = Math.min(radii.bl, w / 2, h / 2);
  return `<a:custGeom><a:avLst/><a:gdLst/><a:ahLst/><a:cxnLst/><a:rect l="l" t="t" r="r" b="b"/><a:pathLst><a:path w="${pxToEmu(w)}" h="${pxToEmu(h)}"><a:moveTo><a:pt x="${pxToEmu(tl)}" y="0"/></a:moveTo><a:lnTo><a:pt x="${pxToEmu(w - tr)}" y="0"/></a:lnTo><a:cubicBezTo><a:pt x="${pxToEmu(w)}" y="0"/><a:pt x="${pxToEmu(w)}" y="0"/><a:pt x="${pxToEmu(w)}" y="${pxToEmu(tr)}"/></a:cubicBezTo><a:lnTo><a:pt x="${pxToEmu(w)}" y="${pxToEmu(h - br)}"/></a:lnTo><a:cubicBezTo><a:pt x="${pxToEmu(w)}" y="${pxToEmu(h)}"/><a:pt x="${pxToEmu(w)}" y="${pxToEmu(h)}"/><a:pt x="${pxToEmu(w - br)}" y="${pxToEmu(h)}"/></a:cubicBezTo><a:lnTo><a:pt x="${pxToEmu(bl)}" y="${pxToEmu(h)}"/></a:lnTo><a:cubicBezTo><a:pt x="0" y="${pxToEmu(h)}"/><a:pt x="0" y="${pxToEmu(h)}"/><a:pt x="0" y="${pxToEmu(h - bl)}"/></a:cubicBezTo><a:lnTo><a:pt x="0" y="${pxToEmu(tl)}"/></a:lnTo><a:cubicBezTo><a:pt x="0" y="0"/><a:pt x="0" y="0"/><a:pt x="${pxToEmu(tl)}" y="0"/></a:cubicBezTo><a:close/></a:path></a:pathLst></a:custGeom>`;
}

function fillXml(fill?: SceneColor, gradient?: GradientFill): string {
  if (gradient) return gradientFillXml(gradient);
  if (!fill) return '<a:noFill/>';
  return `<a:solidFill>${srgb(fill.color, fill.transparency)}</a:solidFill>`;
}

function gradientFillXml(gradient: GradientFill): string {
  const stops = gradient.stops
    .map((stop) => {
      const pos = Math.round(clamp(stop.offset, 0, 1) * 100000);
      return `<a:gs pos="${pos}">${srgb(stop.color.color, stop.color.transparency)}</a:gs>`;
    })
    .join('');
  if (gradient.kind === 'radial') {
    return `<a:gradFill rotWithShape="1"><a:gsLst>${stops}</a:gsLst><a:path path="circle"><a:fillToRect l="50000" t="50000" r="50000" b="50000"/></a:path></a:gradFill>`;
  }
  const cssDeg = gradient.angle ?? 180;
  const ooxmlAng = Math.round(((((cssDeg + 90) % 360) + 360) % 360) * 60000);
  return `<a:gradFill rotWithShape="1"><a:gsLst>${stops}</a:gsLst><a:lin ang="${ooxmlAng}" scaled="0"/></a:gradFill>`;
}

function lineXml(line?: SceneColor & { width: number }): string {
  if (!line) return '<a:ln><a:noFill/></a:ln>';
  return `<a:ln w="${Math.round(line.width * PT_TO_EMU)}"><a:solidFill>${srgb(line.color, line.transparency)}</a:solidFill><a:prstDash val="solid"/></a:ln>`;
}

function effectXml(shadow?: Shadow): string {
  if (!shadow || shadow.inset) return '';
  const dist = Math.round(Math.hypot(shadow.offsetX, shadow.offsetY) * EMU_PER_PX);
  const dir = Math.round(
    (((Math.atan2(shadow.offsetY, shadow.offsetX) * 180) / Math.PI + 360) % 360) * 60000,
  );
  const blur = Math.round(shadow.blur * EMU_PER_PX);
  return `<a:effectLst><a:outerShdw blurRad="${blur}" dist="${dist}" dir="${dir}" algn="tl" rotWithShape="0">${srgb(shadow.color.color, shadow.color.transparency)}</a:outerShdw></a:effectLst>`;
}

function solidFillXml(color: SceneColor): string {
  return `<a:solidFill>${srgb(color.color, color.transparency)}</a:solidFill>`;
}

function srgb(color: string, transparency = 0): string {
  if (transparency <= 0) return `<a:srgbClr val="${color}"/>`;
  const alpha = Math.round((100 - transparency) * 1000);
  return `<a:srgbClr val="${color}"><a:alpha val="${alpha}"/></a:srgbClr>`;
}

function contentTypesXml(
  slideCount: number,
  media: MediaEntry[],
  notesSlideIndexes: number[],
): string {
  const defaults = new Set(['rels', 'xml', 'png', 'jpeg', 'jpg', 'gif', 'svg', 'webp']);
  const defaultXml = [...defaults]
    .map((ext) => {
      const type =
        ext === 'rels'
          ? 'application/vnd.openxmlformats-package.relationships+xml'
          : ext === 'xml'
            ? 'application/xml'
            : ext === 'svg'
              ? 'image/svg+xml'
              : ext === 'jpg' || ext === 'jpeg'
                ? 'image/jpeg'
                : ext === 'gif'
                  ? 'image/gif'
                  : ext === 'webp'
                    ? 'image/webp'
                    : 'image/png';
      return `<Default Extension="${ext}" ContentType="${type}"/>`;
    })
    .join('');

  const overrides = [
    '<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>',
    '<Override PartName="/ppt/presProps.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presProps+xml"/>',
    '<Override PartName="/ppt/viewProps.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.viewProps+xml"/>',
    '<Override PartName="/ppt/tableStyles.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.tableStyles+xml"/>',
    '<Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>',
    '<Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>',
    '<Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>',
    '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>',
    '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>',
  ];
  if (notesSlideIndexes.length > 0) {
    overrides.push(
      '<Override PartName="/ppt/notesMasters/notesMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.notesMaster+xml"/>',
    );
  }
  for (let i = 0; i < slideCount; i++) {
    overrides.push(
      `<Override PartName="/ppt/slides/slide${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`,
    );
  }
  for (const index of notesSlideIndexes) {
    overrides.push(
      `<Override PartName="/ppt/notesSlides/notesSlide${index}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.notesSlide+xml"/>`,
    );
  }
  for (const entry of media) {
    void entry;
  }
  return `${XML_DECL}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">${defaultXml}${overrides.join('')}</Types>`;
}

function rootRelsXml(): string {
  return `${XML_DECL}<Relationships xmlns="${REL_NS}"><Relationship Id="rId1" Type="${OD_REL}/officeDocument" Target="ppt/presentation.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="${OD_REL}/extended-properties" Target="docProps/app.xml"/></Relationships>`;
}

function presentationXml(n: number): string {
  const sldIds = Array.from(
    { length: n },
    (_, i) => `<p:sldId id="${256 + i}" r:id="rId${i + 2}"/>`,
  ).join('');
  return `${XML_DECL}<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="${OD_REL}" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" saveSubsetFonts="1"><p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst><p:sldIdLst>${sldIds}</p:sldIdLst><p:sldSz cx="${EMU_W}" cy="${EMU_H}"/><p:notesSz cx="6858000" cy="9144000"/></p:presentation>`;
}

function presentationRelsXml(n: number): string {
  const rels = [
    `<Relationship Id="rId1" Type="${OD_REL}/slideMaster" Target="slideMasters/slideMaster1.xml"/>`,
  ];
  for (let i = 0; i < n; i++) {
    rels.push(
      `<Relationship Id="rId${i + 2}" Type="${OD_REL}/slide" Target="slides/slide${i + 1}.xml"/>`,
    );
  }
  rels.push(
    `<Relationship Id="rId${n + 2}" Type="${OD_REL}/presProps" Target="presProps.xml"/>`,
    `<Relationship Id="rId${n + 3}" Type="${OD_REL}/viewProps" Target="viewProps.xml"/>`,
    `<Relationship Id="rId${n + 4}" Type="${OD_REL}/theme" Target="theme/theme1.xml"/>`,
    `<Relationship Id="rId${n + 5}" Type="${OD_REL}/tableStyles" Target="tableStyles.xml"/>`,
  );
  return `${XML_DECL}<Relationships xmlns="${REL_NS}">${rels.join('')}</Relationships>`;
}

function coreXml(title: string, author: string): string {
  const now = new Date().toISOString();
  return `${XML_DECL}<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${escapeXml(title)}</dc:title><dc:creator>${escapeXml(author)}</dc:creator><cp:lastModifiedBy>${escapeXml(author)}</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified></cp:coreProperties>`;
}

function appXml(slides: number): string {
  return `${XML_DECL}<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>open-slide</Application><Slides>${slides}</Slides><PresentationFormat>Widescreen</PresentationFormat></Properties>`;
}

function presPropsXml(): string {
  return `${XML_DECL}<p:presentationPr xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="${OD_REL}" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"/>`;
}

function viewPropsXml(): string {
  return `${XML_DECL}<p:viewPr xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="${OD_REL}" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:normalViewPr><p:restoredLeft sz="15620" autoAdjust="0"/><p:restoredTop sz="94660" autoAdjust="0"/></p:normalViewPr><p:slideViewPr><p:cSldViewPr><p:cViewPr varScale="1"><p:scale><a:sx n="100" d="100"/><a:sy n="100" d="100"/></p:scale><p:origin x="0" y="0"/></p:cViewPr></p:cSldViewPr></p:slideViewPr></p:viewPr>`;
}

function tableStylesXml(): string {
  return `${XML_DECL}<a:tblStyleLst xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" def="{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}"/>`;
}

function slideMasterXml(): string {
  return `${XML_DECL}<p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="${OD_REL}" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/><p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst></p:sldMaster>`;
}

function slideMasterRelsXml(): string {
  return `${XML_DECL}<Relationships xmlns="${REL_NS}"><Relationship Id="rId1" Type="${OD_REL}/slideLayout" Target="../slideLayouts/slideLayout1.xml"/><Relationship Id="rId2" Type="${OD_REL}/theme" Target="../theme/theme1.xml"/></Relationships>`;
}

function slideLayoutXml(): string {
  return `${XML_DECL}<p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="${OD_REL}" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="blank" preserve="1"><p:cSld name="Blank"><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>`;
}

function slideLayoutRelsXml(): string {
  return `${XML_DECL}<Relationships xmlns="${REL_NS}"><Relationship Id="rId1" Type="${OD_REL}/slideMaster" Target="../slideMasters/slideMaster1.xml"/></Relationships>`;
}

function notesSlideXml(notes: string, index: number): string {
  return `${XML_DECL}<p:notes xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="${OD_REL}" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/><p:sp><p:nvSpPr><p:cNvPr id="2" name="Slide Image Placeholder 1"/><p:cNvSpPr><a:spLocks noGrp="1" noRot="1" noChangeAspect="1"/></p:cNvSpPr><p:nvPr><p:ph type="sldImg"/></p:nvPr></p:nvSpPr><p:spPr/></p:sp><p:sp><p:nvSpPr><p:cNvPr id="3" name="Notes Placeholder ${index}"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="body" idx="1"/></p:nvPr></p:nvSpPr><p:spPr/><p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang="en-US" dirty="0"/><a:t>${escapeXml(notes)}</a:t></a:r></a:p></p:txBody></p:sp></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:notes>`;
}

function notesSlideRelsXml(slideIndex: number): string {
  return `${XML_DECL}<Relationships xmlns="${REL_NS}"><Relationship Id="rId1" Type="${OD_REL}/notesMaster" Target="../notesMasters/notesMaster1.xml"/><Relationship Id="rId2" Type="${OD_REL}/slide" Target="../slides/slide${slideIndex}.xml"/></Relationships>`;
}

function notesMasterXml(): string {
  return `${XML_DECL}<p:notesMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="${OD_REL}" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/></p:spTree></p:cSld><p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/></p:notesMaster>`;
}

function notesMasterRelsXml(): string {
  return `${XML_DECL}<Relationships xmlns="${REL_NS}"><Relationship Id="rId1" Type="${OD_REL}/theme" Target="../theme/theme1.xml"/></Relationships>`;
}

function themeXml(major: string, minor: string): string {
  return `${XML_DECL}<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="open-slide"><a:themeElements><a:clrScheme name="open-slide"><a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1><a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="44546A"/></a:dk2><a:lt2><a:srgbClr val="E7E6E6"/></a:lt2><a:accent1><a:srgbClr val="4472C4"/></a:accent1><a:accent2><a:srgbClr val="ED7D31"/></a:accent2><a:accent3><a:srgbClr val="A5A5A5"/></a:accent3><a:accent4><a:srgbClr val="FFC000"/></a:accent4><a:accent5><a:srgbClr val="5B9BD5"/></a:accent5><a:accent6><a:srgbClr val="70AD47"/></a:accent6><a:hlink><a:srgbClr val="0563C1"/></a:hlink><a:folHlink><a:srgbClr val="954F72"/></a:folHlink></a:clrScheme><a:fontScheme name="open-slide"><a:majorFont><a:latin typeface="${escapeXml(major)}"/><a:ea typeface=""/><a:cs typeface=""/></a:majorFont><a:minorFont><a:latin typeface="${escapeXml(minor)}"/><a:ea typeface=""/><a:cs typeface=""/></a:minorFont></a:fontScheme><a:fmtScheme name="open-slide"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:fillStyleLst><a:lnStyleLst><a:ln w="6350" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln><a:ln w="12700" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln><a:ln w="19050" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements></a:theme>`;
}

function parseDataUri(
  dataUri: string,
): { bytes: Uint8Array; contentType: string; ext: string } | undefined {
  const match = dataUri.match(/^data:([^;,]+)?(;base64)?,(.*)$/s);
  if (!match) return undefined;
  const contentType = match[1] || 'application/octet-stream';
  const isBase64 = Boolean(match[2]);
  const payload = match[3];
  const bytes = isBase64 ? base64ToBytes(payload) : strToU8(decodeURIComponent(payload));
  const ext = contentType.includes('svg')
    ? 'svg'
    : contentType.includes('jpeg') || contentType.includes('jpg')
      ? 'jpg'
      : contentType.includes('gif')
        ? 'gif'
        : contentType.includes('webp')
          ? 'webp'
          : 'png';
  return { bytes, contentType, ext };
}

function base64ToBytes(payload: string): Uint8Array {
  if (typeof Buffer !== 'undefined') {
    return Uint8Array.from(Buffer.from(payload, 'base64'));
  }
  return Uint8Array.from(atob(payload), (c) => c.charCodeAt(0));
}

function fnv1a(bytes: Uint8Array): string {
  let hash = 0x811c9dc5;
  for (const byte of bytes) {
    hash ^= byte;
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16);
}

function resolveZipPath(base: string, target: string): string {
  const parts = [...base.split('/').filter(Boolean), ...target.split('/')];
  const resolved: string[] = [];
  for (const part of parts) {
    if (part === '.' || part === '') continue;
    if (part === '..') {
      resolved.pop();
      continue;
    }
    resolved.push(part);
  }
  return resolved.join('/');
}

function decode(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
