import { strFromU8, unzipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import { buildImagePptx } from './export-pptx';

describe('raster PPTX export', () => {
  it('builds each page as one full-bleed 16:9 image', async () => {
    const pptx = await buildImagePptx([
      new Uint8Array([137, 80, 78, 71]),
      new Uint8Array([137, 80, 78, 71]),
    ]);
    const files = unzipSync(pptx);
    const presentationXml = strFromU8(files['ppt/presentation.xml']);
    const firstSlideXml = strFromU8(files['ppt/slides/slide1.xml']);

    expect(files['[Content_Types].xml']).toBeDefined();
    expect(files['ppt/media/image1.png']).toBeDefined();
    expect(files['ppt/media/image2.png']).toBeDefined();
    expect(presentationXml).toContain('<p:sldSz cx="12192000" cy="6858000"/>');
    expect(firstSlideXml.match(/<p:pic>/g)).toHaveLength(1);
    expect(firstSlideXml).toContain('<a:off x="0" y="0"/>');
    expect(firstSlideXml).toContain('<a:ext cx="12192000" cy="6858000"/>');
  });
});
