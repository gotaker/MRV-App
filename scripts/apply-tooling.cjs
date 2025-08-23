/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const pkgPath = path.resolve(process.cwd(), 'package.json');
if (!fs.existsSync(pkgPath)) {
  console.error('package.json not found in current directory');
  process.exit(1);
}
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

// engines
pkg.engines = pkg.engines || {};
pkg.engines.node = '22.12.x';
pkg.engines.npm = pkg.engines.npm || '>=10';

// scripts
pkg.scripts = pkg.scripts || {};
if (!pkg.scripts.prepare) {
  pkg.scripts.prepare = 'husky install';
}

// lint-staged config
pkg['lint-staged'] = pkg['lint-staged'] || {
  '*.{ts,tsx,js}': ['eslint --fix', 'git add'],
  '*.{scss,css,html,md}': ['prettier --write', 'git add']
};

// devDependencies
pkg.devDependencies = pkg.devDependencies || {};
pkg.devDependencies['lint-staged'] = pkg.devDependencies['lint-staged'] || '^15.2.9';
pkg.devDependencies['husky'] = pkg.devDependencies['husky'] || '^9.0.11';

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
console.log('Updated package.json with engines, prepare, lint-staged, and devDependencies.');
