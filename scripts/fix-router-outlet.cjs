
/* scripts/fix-router-outlet.cjs */
const fs = require('fs');
const path = require('path');

const file = path.resolve('src/app/app.component.ts');
if (!fs.existsSync(file)) {
  console.log('app.component.ts not found; skipping RouterOutlet fix.');
  process.exit(0);
}
let s = fs.readFileSync(file, 'utf8');
let changed = false;

// Remove `import { RouterOutlet } from '@angular/router';`
const importRe = /import\s*\{\s*RouterOutlet\s*\}\s*from\s*['"]@angular\/router['"];\s*\r?\n?/;
if (importRe.test(s)) {
  s = s.replace(importRe, '');
  changed = true;
}

// Remove RouterOutlet from `imports: [ ... ]`
const importsArrRe = /(imports\s*:\s*\[)([\s\S]*?)(\])/m;
if (importsArrRe.test(s)) {
  s = s.replace(importsArrRe, (_m, p1, middle, p3) => {
    const cleaned = middle
      .replace(/RouterOutlet\s*,\s*/g, '')
      .replace(/,\s*RouterOutlet/g, '')
      .replace(/RouterOutlet/g, '');
    if (cleaned !== middle) changed = true;
    return p1 + cleaned + p3;
  });
}

if (changed) {
  fs.writeFileSync(file, s, 'utf8');
  console.log('RouterOutlet references removed from app.component.ts');
} else {
  console.log('No RouterOutlet references found; nothing to change.');
}
