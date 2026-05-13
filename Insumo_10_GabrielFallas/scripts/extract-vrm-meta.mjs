import fs from 'node:fs/promises';
import path from 'node:path';

const VRM_FILES = [
  { id: 'zed', file: 'public/models/zed.vrm' },
  { id: 'yuki', file: 'public/models/yuki.vrm' },
  { id: 'alicia', file: 'public/models/alicia.vrm' },
];

function readUint32LE(buffer, offset) {
  return buffer.readUInt32LE(offset);
}

function parseGlbJson(buffer) {
  // https://github.com/KhronosGroup/glTF/tree/main/specification/2.0#glb-file-format-specification
  const magic = buffer.toString('utf8', 0, 4);
  if (magic !== 'glTF') throw new Error(`Not a GLB/VRM file (magic=${magic})`);

  let offset = 12; // header
  while (offset < buffer.length) {
    const chunkLength = readUint32LE(buffer, offset);
    const chunkType = readUint32LE(buffer, offset + 4);
    offset += 8;

    const chunkData = buffer.subarray(offset, offset + chunkLength);
    offset += chunkLength;

    // 0x4E4F534A = JSON
    if (chunkType === 0x4e4f534a) {
      const jsonText = new TextDecoder('utf-8').decode(chunkData);
      return JSON.parse(jsonText);
    }
  }

  throw new Error('GLB missing JSON chunk');
}

function pickVrmMeta(json) {
  const extensions = json?.extensions;
  const vrm1 = extensions?.VRMC_vrm;
  const vrm0 = extensions?.VRM;

  if (vrm1?.meta) {
    return { version: 'VRM1', meta: vrm1.meta };
  }

  if (vrm0?.meta) {
    return { version: 'VRM0', meta: vrm0.meta };
  }

  return { version: 'unknown', meta: null };
}

for (const f of VRM_FILES) {
  const abs = path.resolve(f.file);
  const buf = await fs.readFile(abs);
  const json = parseGlbJson(buf);
  const { version, meta } = pickVrmMeta(json);

  console.log(`\n=== ${f.id} (${version}) ===`);
  if (!meta) {
    console.log('No VRM meta found');
    continue;
  }

  // Print a stable subset.
  const out = {
    title: meta.title ?? meta.name ?? undefined,
    authors: meta.authors ?? (meta.author ? [meta.author] : undefined),
    contactInformation: meta.contactInformation,
    reference: meta.reference,
    licenseName: meta.licenseName,
    licenseUrl: meta.licenseUrl,
    otherLicenseUrl: meta.otherLicenseUrl,
    commercialUsage: meta.commercialUsage ?? meta.commercialUssageName,
    creditNotation: meta.creditNotation,
    allowRedistribution: meta.allowRedistribution,
    modification: meta.modification,
    avatarPermission: meta.avatarPermission,
    violentUsage: meta.violentUsage ?? meta.violentUssageName,
    sexualUsage: meta.sexualUsage ?? meta.sexualUssageName,
  };

  console.log(JSON.stringify(out, null, 2));
}
