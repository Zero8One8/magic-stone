import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const root = process.cwd();
const statePath = path.join(root, ".watermark-state.json");
const version = "wm-v2-soft";
const sourceDirs = [
  path.join(root, "src", "assets"),
  path.join(root, "src", "assets", "shop"),
  path.join(root, "src", "assets", "chakras"),
];
const channelOutDir = path.join(root, "public", "channel-images");
const imageExt = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const toPosix = (p) => p.split(path.sep).join("/");

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function readJson(p, fallback) {
  if (!(await exists(p))) return fallback;
  try {
    const raw = await fs.readFile(p, "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

async function walk(dir, out = []) {
  if (!(await exists(dir))) return out;
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full, out);
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (imageExt.has(ext)) out.push(full);
  }
  return out;
}

function hashBuffer(buffer) {
  return crypto.createHash("sha1").update(buffer).digest("hex");
}

function escapeXml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function buildOverlaySvg(width, height, label) {
  const fontSize = Math.max(12, Math.round(Math.min(width, height) * 0.028));
  const smallSize = Math.max(10, Math.round(Math.min(width, height) * 0.016));
  const repeated = `${label}    ${label}    ${label}`;

  return `
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="rgba(255,255,255,0.00)" />
        <stop offset="100%" stop-color="rgba(255,255,255,0.00)" />
      </linearGradient>
    </defs>

    <rect x="0" y="0" width="${width}" height="${height}" fill="url(#bg)" />

    <g transform="translate(${Math.round(width / 2)}, ${Math.round(height / 2)}) rotate(-18)">
      <text
        x="0"
        y="0"
        text-anchor="middle"
        dominant-baseline="middle"
        font-family="Segoe UI, Arial, sans-serif"
        font-size="${fontSize}"
        font-weight="700"
        letter-spacing="1.3"
        fill="rgba(255,255,255,0.09)"
      >${escapeXml(repeated)}</text>
    </g>

    <g>
      <rect
        x="${Math.max(6, width - 240)}"
        y="${Math.max(6, height - 34)}"
        width="${Math.min(216, width - 12)}"
        height="24"
        rx="6"
        fill="rgba(0,0,0,0.26)"
        stroke="rgba(255,255,255,0.18)"
      />
      <text
        x="${Math.max(14, width - 214)}"
        y="${Math.max(23, height - 11)}"
        font-family="Segoe UI, Arial, sans-serif"
        font-size="${smallSize}"
        font-weight="700"
        letter-spacing="1"
        fill="rgba(255,255,255,0.72)"
      >${escapeXml(label)}</text>
    </g>
  </svg>`;
}

async function ensureDirForFile(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function processImage(absPath, state) {
  const rel = toPosix(path.relative(root, absPath));
  const original = await fs.readFile(absPath);
  const currentHash = hashBuffer(original);

  const prev = state[rel];
  const skip = prev && prev.hash === currentHash && prev.version === version;
  const outRel = rel.startsWith("src/assets/")
    ? rel.replace("src/assets/", "")
    : path.basename(rel);
  const channelOut = path.join(channelOutDir, outRel);

  if (skip) {
    if (!(await exists(channelOut))) {
      await ensureDirForFile(channelOut);
      await fs.writeFile(channelOut, original);
    }
    return { rel, changed: false };
  }

  const image = sharp(original, { failOn: "none" });
  const meta = await image.metadata();
  const width = meta.width || 0;
  const height = meta.height || 0;

  if (width < 120 || height < 120) {
    await ensureDirForFile(channelOut);
    await fs.writeFile(channelOut, original);
    state[rel] = { hash: currentHash, version };
    return { rel, changed: false };
  }

  const svg = Buffer.from(buildOverlaySvg(width, height, "magic-stone.org"));

  const result = await sharp(original)
    .composite([{ input: svg, blend: "over" }])
    .toFormat(meta.format === "png" ? "png" : meta.format === "webp" ? "webp" : "jpeg", {
      quality: 95,
      effort: 5,
      mozjpeg: true,
    })
    .toBuffer();

  await fs.writeFile(absPath, result);
  await ensureDirForFile(channelOut);
  await fs.writeFile(channelOut, result);

  state[rel] = { hash: hashBuffer(result), version };
  return { rel, changed: true };
}

async function main() {
  const state = await readJson(statePath, {});

  const all = [];
  for (const dir of sourceDirs) {
    const files = await walk(dir);
    for (const file of files) all.push(file);
  }

  let changed = 0;
  for (const file of all) {
    const result = await processImage(file, state);
    if (result.changed) {
      changed += 1;
      console.log(`WM: ${result.rel}`);
    }
  }

  await fs.writeFile(statePath, JSON.stringify(state, null, 2) + "\n", "utf8");
  console.log(`Watermark done. Changed: ${changed}. Total scanned: ${all.length}.`);
  console.log(`Channel-ready images: ${toPosix(path.relative(root, channelOutDir))}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
