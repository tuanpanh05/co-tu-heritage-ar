import fs from 'fs';
import path from 'path';

/**
 * Trình tạo file GLB (Binary glTF 2.0) hợp lệ cho dự án CO TU HERITAGE AR.
 * Tạo các mô hình 3D hình học minh họa với bảng màu hài hòa (Ngọc bích rừng, Tre vàng nắng sớm, Gỗ trầm dịu):
 * 1. guol.glb - Mô hình 3D minh họa Nhà Gươl
 * 2. ktu-drum.glb - Mô hình 3D minh họa Trống K'tu
 * 3. tkoor.glb - Mô hình 3D minh họa Cột tế T'kơơr
 */

class MeshBuilder {
  constructor() {
    this.positions = [];
    this.normals = [];
    this.indices = [];
  }

  addVertex(x, y, z, nx, ny, nz) {
    const idx = this.positions.length / 3;
    this.positions.push(x, y, z);
    this.normals.push(nx, ny, nz);
    return idx;
  }

  addTriangle(v0, v1, v2) {
    const [x0, y0, z0] = v0;
    const [x1, y1, z1] = v1;
    const [x2, y2, z2] = v2;

    const ux = x1 - x0, uy = y1 - y0, uz = z1 - z0;
    const vx = x2 - x0, vy = y2 - y0, vz = z2 - z0;
    let nx = uy * vz - uz * vy;
    let ny = uz * vx - ux * vz;
    let nz = ux * vy - uy * vx;
    const len = Math.hypot(nx, ny, nz) || 1;
    nx /= len; ny /= len; nz /= len;

    const i0 = this.addVertex(x0, y0, z0, nx, ny, nz);
    const i1 = this.addVertex(x1, y1, z1, nx, ny, nz);
    const i2 = this.addVertex(x2, y2, z2, nx, ny, nz);
    this.indices.push(i0, i1, i2);
  }

  addQuad(v0, v1, v2, v3) {
    this.addTriangle(v0, v1, v2);
    this.addTriangle(v0, v2, v3);
  }

  addBox(cx, cy, cz, sx, sy, sz) {
    const hx = sx / 2, hy = sy / 2, hz = sz / 2;
    const p000 = [cx - hx, cy - hy, cz - hz];
    const p001 = [cx - hx, cy - hy, cz + hz];
    const p010 = [cx - hx, cy + hy, cz - hz];
    const p011 = [cx - hx, cy + hy, cz + hz];
    const p100 = [cx + hx, cy - hy, cz - hz];
    const p101 = [cx + hx, cy - hy, cz + hz];
    const p110 = [cx + hx, cy + hy, cz - hz];
    const p111 = [cx + hx, cy + hy, cz + hz];

    this.addQuad(p001, p101, p111, p011);
    this.addQuad(p100, p000, p010, p110);
    this.addQuad(p011, p111, p110, p010);
    this.addQuad(p000, p100, p101, p001);
    this.addQuad(p101, p100, p110, p111);
    this.addQuad(p000, p001, p011, p010);
  }

  addCylinderY(cx, cyBottom, cz, rBottom, rTop, height, segments = 18, scaleZ = 1.0) {
    const y0 = cyBottom;
    const y1 = cyBottom + height;

    for (let i = 0; i < segments; i++) {
      const a0 = (i / segments) * Math.PI * 2;
      const a1 = ((i + 1) / segments) * Math.PI * 2;

      const x0b = cx + Math.cos(a0) * rBottom;
      const z0b = cz + Math.sin(a0) * rBottom * scaleZ;
      const x1b = cx + Math.cos(a1) * rBottom;
      const z1b = cz + Math.sin(a1) * rBottom * scaleZ;

      const x0t = cx + Math.cos(a0) * rTop;
      const z0t = cz + Math.sin(a0) * rTop * scaleZ;
      const x1t = cx + Math.cos(a1) * rTop;
      const z1t = cz + Math.sin(a1) * rTop * scaleZ;

      this.addQuad([x0b, y0, z0b], [x0t, y1, z0t], [x1t, y1, z1t], [x1b, y0, z1b]);

      if (rTop > 0.001) {
        this.addTriangle([cx, y1, cz], [x1t, y1, z1t], [x0t, y1, z0t]);
      }
      if (rBottom > 0.001) {
        this.addTriangle([cx, y0, cz], [x0b, y0, z0b], [x1b, y0, z1b]);
      }
    }
  }

  addCylinderX(cx, cy, cz, rLeft, rRight, length, segments = 20) {
    const x0 = cx - length / 2;
    const x1 = cx + length / 2;

    for (let i = 0; i < segments; i++) {
      const a0 = (i / segments) * Math.PI * 2;
      const a1 = ((i + 1) / segments) * Math.PI * 2;

      const y0l = cy + Math.cos(a0) * rLeft;
      const z0l = cz + Math.sin(a0) * rLeft;
      const y1l = cy + Math.cos(a1) * rLeft;
      const z1l = cz + Math.sin(a1) * rLeft;

      const y0r = cy + Math.cos(a0) * rRight;
      const z0r = cz + Math.sin(a0) * rRight;
      const y1r = cy + Math.cos(a1) * rRight;
      const z1r = cz + Math.sin(a1) * rRight;

      this.addQuad([x0, y0l, z0l], [x1, y0r, z0r], [x1, y1r, z1r], [x0, y1l, z1l]);

      if (rRight > 0.001) {
        this.addTriangle([x1, cy, cz], [x1, y1r, z1r], [x1, y0r, z0r]);
      }
      if (rLeft > 0.001) {
        this.addTriangle([x0, cy, cz], [x0, y0l, z0l], [x0, y1l, z1l]);
      }
    }
  }

  getBounds() {
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < this.positions.length; i += 3) {
      min[0] = Math.min(min[0], this.positions[i]);
      min[1] = Math.min(min[1], this.positions[i + 1]);
      min[2] = Math.min(min[2], this.positions[i + 2]);
      max[0] = Math.max(max[0], this.positions[i]);
      max[1] = Math.max(max[1], this.positions[i + 1]);
      max[2] = Math.max(max[2], this.positions[i + 2]);
    }
    return { min, max };
  }
}

function exportGLB(parts) {
  const bufferViews = [];
  const accessors = [];
  const primitives = [];
  const materials = [];
  const binaryChunks = [];
  let byteOffset = 0;

  parts.forEach((part, idx) => {
    materials.push({
      name: part.name || `Mat_${idx}`,
      pbrMetallicRoughness: {
        baseColorFactor: part.color,
        metallicFactor: part.metallic ?? 0.08,
        roughnessFactor: part.roughness ?? 0.75
      },
      doubleSided: true
    });

    const posArray = new Float32Array(part.mesh.positions);
    const normArray = new Float32Array(part.mesh.normals);
    const idxArray = new Uint16Array(part.mesh.indices);

    const posBuf = Buffer.from(posArray.buffer);
    const normBuf = Buffer.from(normArray.buffer);
    let idxBuf = Buffer.from(idxArray.buffer);
    if (idxBuf.length % 4 !== 0) {
      const pad = 4 - (idxBuf.length % 4);
      idxBuf = Buffer.concat([idxBuf, Buffer.alloc(pad)]);
    }

    const posBvIndex = bufferViews.length;
    bufferViews.push({
      buffer: 0,
      byteOffset,
      byteLength: posBuf.length,
      target: 34962
    });
    byteOffset += posBuf.length;
    binaryChunks.push(posBuf);

    const bounds = part.mesh.getBounds();
    const posAccIndex = accessors.length;
    accessors.push({
      bufferView: posBvIndex,
      componentType: 5126,
      count: part.mesh.positions.length / 3,
      type: 'VEC3',
      min: bounds.min,
      max: bounds.max
    });

    const normBvIndex = bufferViews.length;
    bufferViews.push({
      buffer: 0,
      byteOffset,
      byteLength: normBuf.length,
      target: 34962
    });
    byteOffset += normBuf.length;
    binaryChunks.push(normBuf);

    const normAccIndex = accessors.length;
    accessors.push({
      bufferView: normBvIndex,
      componentType: 5126,
      count: part.mesh.normals.length / 3,
      type: 'VEC3'
    });

    const idxBvIndex = bufferViews.length;
    bufferViews.push({
      buffer: 0,
      byteOffset,
      byteLength: idxArray.byteLength,
      target: 34963
    });
    byteOffset += idxBuf.length;
    binaryChunks.push(idxBuf);

    const idxAccIndex = accessors.length;
    accessors.push({
      bufferView: idxBvIndex,
      componentType: 5123,
      count: part.mesh.indices.length,
      type: 'SCALAR'
    });

    primitives.push({
      attributes: {
        POSITION: posAccIndex,
        NORMAL: normAccIndex
      },
      indices: idxAccIndex,
      material: idx
    });
  });

  const binBuffer = Buffer.concat(binaryChunks);

  const gltf = {
    asset: {
      version: '2.0',
      generator: 'CoTuHeritageAR-ProceduralBuilder'
    },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ name: 'ArtifactRoot', mesh: 0 }],
    meshes: [{ name: 'ArtifactMesh', primitives }],
    materials,
    buffers: [{ byteLength: binBuffer.length }],
    bufferViews,
    accessors
  };

  let jsonString = JSON.stringify(gltf);
  while (Buffer.byteLength(jsonString, 'utf8') % 4 !== 0) {
    jsonString += ' ';
  }
  const jsonBuffer = Buffer.from(jsonString, 'utf8');

  const totalLength = 12 + 8 + jsonBuffer.length + 8 + binBuffer.length;
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546C67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(totalLength, 8);

  const jsonChunkHeader = Buffer.alloc(8);
  jsonChunkHeader.writeUInt32LE(jsonBuffer.length, 0);
  jsonChunkHeader.writeUInt32LE(0x4E4F534A, 4);

  const binChunkHeader = Buffer.alloc(8);
  binChunkHeader.writeUInt32LE(binBuffer.length, 0);
  binChunkHeader.writeUInt32LE(0x004E4942, 4);

  return Buffer.concat([header, jsonChunkHeader, jsonBuffer, binChunkHeader, binBuffer]);
}

function buildGuolModel() {
  const baseMesh = new MeshBuilder();
  baseMesh.addCylinderY(0, 0, 0, 2.2, 2.0, 0.14, 28, 0.78);

  const woodDarkMesh = new MeshBuilder();
  woodDarkMesh.addCylinderY(0, 0.14, 0, 0.18, 0.15, 2.2, 18, 1.0);
  const stiltAngles = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI, (5 * Math.PI) / 4, (3 * Math.PI) / 2, (7 * Math.PI) / 4];
  stiltAngles.forEach((a) => {
    const sx = Math.cos(a) * 1.25;
    const sz = Math.sin(a) * 0.85;
    woodDarkMesh.addCylinderY(sx, 0.14, sz, 0.08, 0.08, 0.75, 12, 1.0);
  });
  woodDarkMesh.addBox(0, 0.5, 1.15, 0.35, 0.75, 0.12);

  const deckMesh = new MeshBuilder();
  deckMesh.addCylinderY(0, 0.88, 0, 1.5, 1.55, 0.12, 28, 0.72);
  deckMesh.addCylinderY(0, 1.0, 0, 1.45, 1.6, 0.45, 28, 0.72);

  const roofMesh = new MeshBuilder();
  roofMesh.addCylinderY(0, 1.4, 0, 1.85, 1.35, 0.7, 28, 0.74);
  roofMesh.addCylinderY(0, 2.1, 0, 1.35, 0.7, 0.75, 28, 0.74);
  roofMesh.addCylinderY(0, 2.85, 0, 0.7, 0.08, 0.65, 28, 0.74);

  const ornamentMesh = new MeshBuilder();
  ornamentMesh.addBox(0, 3.55, 0, 0.7, 0.08, 0.08);
  ornamentMesh.addCylinderY(0, 3.45, 0, 0.06, 0.02, 0.35, 14, 1.0);

  return exportGLB([
    { name: 'MistPedestal', mesh: baseMesh, color: [0.76, 0.85, 0.80, 1.0], roughness: 0.9 },
    { name: 'TimberPillars', mesh: woodDarkMesh, color: [0.35, 0.25, 0.19, 1.0], roughness: 0.8 },
    { name: 'WarmBambooDeck', mesh: deckMesh, color: [0.76, 0.61, 0.38, 1.0], roughness: 0.72 },
    { name: 'JadeForestRoof', mesh: roofMesh, color: [0.16, 0.45, 0.36, 1.0], roughness: 0.82 },
    { name: 'GoldenCrest', mesh: ornamentMesh, color: [0.83, 0.66, 0.33, 1.0], roughness: 0.45 }
  ]);
}

function buildDrumModel() {
  const standMesh = new MeshBuilder();
  standMesh.addCylinderY(0, 0, 0, 1.4, 1.3, 0.12, 24, 0.8);
  standMesh.addBox(-0.6, 0.65, 0, 0.12, 1.1, 0.7);
  standMesh.addBox(0.6, 0.65, 0, 0.12, 1.1, 0.7);

  const shellMesh = new MeshBuilder();
  shellMesh.addCylinderX(-0.45, 1.15, 0, 0.52, 0.65, 0.9, 24);
  shellMesh.addCylinderX(0.45, 1.15, 0, 0.65, 0.52, 0.9, 24);

  const hideMesh = new MeshBuilder();
  hideMesh.addCylinderX(-0.91, 1.15, 0, 0.53, 0.53, 0.04, 24);
  hideMesh.addCylinderX(0.91, 1.15, 0, 0.53, 0.53, 0.04, 24);
  hideMesh.addCylinderX(0, 1.15, 0, 0.665, 0.665, 0.08, 24);

  return exportGLB([
    { name: 'JadeStand', mesh: standMesh, color: [0.15, 0.42, 0.34, 1.0], roughness: 0.82 },
    { name: 'WarmWoodShell', mesh: shellMesh, color: [0.52, 0.36, 0.25, 1.0], roughness: 0.72 },
    { name: 'SoftIvoryHide', mesh: hideMesh, color: [0.95, 0.91, 0.81, 1.0], roughness: 0.6 }
  ]);
}

function buildTkoorModel() {
  const baseMesh = new MeshBuilder();
  baseMesh.addCylinderY(0, 0, 0, 1.1, 0.95, 0.2, 24, 1.0);

  const pillarMesh = new MeshBuilder();
  pillarMesh.addCylinderY(0, 0.2, 0, 0.22, 0.16, 3.2, 18, 1.0);

  const motifMesh = new MeshBuilder();
  motifMesh.addBox(0, 2.6, 0, 1.9, 0.22, 0.08);
  motifMesh.addBox(0, 1.8, 0, 1.4, 0.18, 0.08);
  motifMesh.addBox(-0.95, 2.85, 0, 0.18, 0.45, 0.08);
  motifMesh.addBox(0.95, 2.85, 0, 0.18, 0.45, 0.08);

  const sunDiskMesh = new MeshBuilder();
  sunDiskMesh.addCylinderY(0, 1.2, 0, 0.28, 0.28, 0.25, 18, 1.0);
  sunDiskMesh.addCylinderY(0, 3.4, 0, 0.16, 0.02, 0.45, 14, 1.0);

  return exportGLB([
    { name: 'MistBase', mesh: baseMesh, color: [0.76, 0.85, 0.80, 1.0], roughness: 0.9 },
    { name: 'SacredPost', mesh: pillarMesh, color: [0.38, 0.27, 0.20, 1.0], roughness: 0.78 },
    { name: 'JadeWings', mesh: motifMesh, color: [0.16, 0.48, 0.39, 1.0], roughness: 0.7 },
    { name: 'GoldenSun', mesh: sunDiskMesh, color: [0.85, 0.68, 0.34, 1.0], roughness: 0.45 }
  ]);
}

const outDir = path.resolve('public/models');
fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(path.join(outDir, 'guol.glb'), buildGuolModel());
fs.writeFileSync(path.join(outDir, 'ktu-drum.glb'), buildDrumModel());
fs.writeFileSync(path.join(outDir, 'tkoor.glb'), buildTkoorModel());

console.log('Successfully generated 3D GLB models in public/models/: guol.glb, ktu-drum.glb, tkoor.glb');
