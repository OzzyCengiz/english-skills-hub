import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const ENTRY = path.join(ROOT, 'src', 'main.js');
const OUT_DIR = path.join(ROOT, 'dist');
const OUT_FILE = path.join(OUT_DIR, 'app.bundle.js');

const visited = new Set();
const ordered = [];

function collect(filePath) {
  const fullPath = path.resolve(filePath);
  if (visited.has(fullPath)) return;
  visited.add(fullPath);

  const src = fs.readFileSync(fullPath, 'utf8');
  const importRegex = /import\s+(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]\s*;?/g;
  let match;
  while ((match = importRegex.exec(src))) {
    const depPath = path.resolve(path.dirname(fullPath), match[1]);
    collect(depPath);
  }
  ordered.push({ fullPath, src });
}

collect(ENTRY);

const enJson = fs.readFileSync(path.join(ROOT, 'locales', 'en.json'), 'utf8');
const trJson = fs.readFileSync(path.join(ROOT, 'locales', 'tr.json'), 'utf8');
const worldSvg = fs.readFileSync(path.join(ROOT, 'world.svg'), 'utf8');

const chunks = [
  '/* Auto-generated bundle from /src, /locales, and /world.svg — works on file:// and http:// */',
  '(function () {',
  '  "use strict";',
  `  globalThis.__LAST_BREATH_EN__ = ${enJson.trim()};`,
  `  globalThis.__LAST_BREATH_TR__ = ${trJson.trim()};`,
  `  globalThis.__LAST_BREATH_WORLD_SVG__ = ${JSON.stringify(worldSvg)};`,
];

for (const { fullPath, src } of ordered) {
  const rel = path.relative(ROOT, fullPath).replace(/\\/g, '/');
  const transformed = src
    .replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"]\s*;?/g, '')
    .replace(/export\s+default\s+/g, '')
    .replace(/export\s+(?=(?:const|let|var|function|async\s+function|class)\s)/g, '')
    .replace(/export\s*\{[^}]*\}\s*(?:from\s*['"][^'"]+['"])?\s*;?/g, '');

  chunks.push(`\n  // --- ${rel} ---\n${transformed}`);
}

chunks.push('})();\n');

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, chunks.join('\n'), 'utf8');
console.log(`Built ${path.relative(ROOT, OUT_FILE)} (${ordered.length} modules).`);
