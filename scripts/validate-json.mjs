#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const files = process.argv.includes('--file')
  ? [process.argv[process.argv.indexOf('--file') + 1]]
  : [
      'package.json',
      'angular.json',
      'proxy.conf.json',
      'tsconfig.json',
      'tsconfig.app.json',
      'tsconfig.spec.json'
    ];

let bad = false;

for (const f of files) {
  const p = path.resolve(process.cwd(), f);
  try {
    const raw = fs.readFileSync(p, 'utf8');
    JSON.parse(raw);
    console.log(`✅ ${f} is valid JSON`);
  } catch (e) {
    bad = true;
    console.error(`❌ ${f} is invalid JSON:\n${e.message}`);
  }
}

if (bad) process.exit(1);
