#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const scssFiles = [
  'src/styles.scss',
  'src/styles/theme.scss'
].map(p => path.join(root, p));

const re = /@(use|import)\s+['"]([^'"]+)['"]/g;

let ok = true;

for (const file of scssFiles) {
  if (!fs.existsSync(file)) {
    console.error(`❌ Missing SCSS file: ${path.relative(root, file)}`);
    ok = false;
    continue;
  }
  const text = fs.readFileSync(file, 'utf8');
  let m;
  while ((m = re.exec(text))) {
    const spec = m[2];
    // only check local files (ignore packages like '@angular/material')
    if (spec.startsWith('.') || spec.startsWith('src') || spec.startsWith('/')) {
      // resolve from the importing file dir
      const baseDir = path.dirname(file);
      const tryPaths = [
        path.resolve(baseDir, spec + '.scss'),
        path.resolve(baseDir, spec),
        path.resolve(root, spec + '.scss'),
        path.resolve(root, spec)
      ];
      if (!tryPaths.some(p => fs.existsSync(p))) {
        console.error(
          `❌ ${path.relative(root, file)} → missing import: "${spec}"`
        );
        ok = false;
      }
    }
  }
}

if (!ok) process.exit(1);
console.log('✅ SCSS imports look good');
