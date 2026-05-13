import { NodeIO } from '@gltf-transform/core';
import path from 'node:path';

const MODELS = [
  {
  id: 'zed',
  file: 'public/models/zed.vrm',
  },
  {
  id: 'yuki',
  file: 'public/models/yuki.vrm',
  },
  {
  id: 'alicia',
  file: 'public/models/alicia.vrm',
  },
];

function safeJson(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

async function inspectModel(modelPath) {
  const io = new NodeIO();
  const doc = await io.read(modelPath);
  const root = doc.getRoot();

  const meshes = root.listMeshes();
  const skins = root.listSkins();

  let vertexCount = 0;
  let triangleCount = 0;
  let primitiveCount = 0;
  let morphTargetCount = 0;
  const morphTargetNames = new Set();

  for (const mesh of meshes) {
    const extras = mesh.getExtras();
    const targetNames = extras && typeof extras === 'object' ? extras.targetNames : undefined;

    for (const prim of mesh.listPrimitives()) {
      primitiveCount += 1;

      const position = prim.getAttribute('POSITION');
      if (position) vertexCount += position.getCount();

      const indices = prim.getIndices();
      if (indices) {
        triangleCount += Math.floor(indices.getCount() / 3);
      } else if (position) {
        triangleCount += Math.floor(position.getCount() / 3);
      }

      const targets = prim.listTargets();
      morphTargetCount += targets.length;

      if (Array.isArray(targetNames)) {
        for (const name of targetNames) morphTargetNames.add(String(name));
      }
    }
  }

  const jointCounts = skins.map((s) => s.listJoints().length);
  const maxJoints = jointCounts.length ? Math.max(...jointCounts) : 0;

  return {
    meshes: meshes.length,
    primitives: primitiveCount,
    vertices: vertexCount,
    triangles: triangleCount,
    skins: skins.length,
    maxJoints,
    morphTargetsTotal: morphTargetCount,
    morphTargetNames: Array.from(morphTargetNames).sort(),
    extensionsUsed: root.listExtensionsUsed().map((e) => e.extensionName).sort(),
  };
}

for (const m of MODELS) {
  const abs = path.resolve(m.file);
  const info = await inspectModel(abs);
  console.log(`\n=== ${m.id} ===`);
  console.log(safeJson(info));
}
