
/* scripts/fix-styles-config.cjs */
const fs = require('fs');

const ANGULAR = 'angular.json';
if (!fs.existsSync(ANGULAR)) {
  console.error('angular.json not found; skip styles config fix.');
  process.exit(0);
}
const json = JSON.parse(fs.readFileSync(ANGULAR, 'utf8'));
let changed = false;

const scrub = (stylesArr) => {
  if (!Array.isArray(stylesArr)) return false;
  let mutated = false;
  // Remove explicit entries for theme.scss and duplicate styles.scss
  for (let i = stylesArr.length - 1; i >= 0; i--) {
    const v = stylesArr[i];
    const p = typeof v === 'string' ? v : v?.input;
    if (typeof p !== 'string') continue;
    if (p.endsWith('src/styles/theme.scss')) {
      stylesArr.splice(i, 1);
      mutated = true;
    }
  }
  // Ensure styles.scss exists once
  const hasStyles = stylesArr.some(v => (typeof v === 'string' ? v : v?.input) === 'src/styles.scss');
  if (!hasStyles) {
    stylesArr.unshift('src/styles.scss');
    mutated = true;
  }
  return mutated;
};

const projects = json.projects || {};
for (const name of Object.keys(projects)) {
  const p = projects[name];
  const build = p?.architect?.build?.options;
  const test  = p?.architect?.test?.options;
  if (build?.styles) changed = scrub(build.styles) || changed;
  if (test?.styles)  changed = scrub(test.styles) || changed;
  const build2 = p?.targets?.build?.options;
  const test2  = p?.targets?.test?.options;
  if (build2?.styles) changed = scrub(build2.styles) || changed;
  if (test2?.styles)  changed = scrub(test2.styles) || changed;
}

if (changed) {
  fs.writeFileSync(ANGULAR, JSON.stringify(json, null, 2) + '\n', 'utf8');
  console.log('Updated angular.json: only src/styles.scss is referenced.');
} else {
  console.log('angular.json styles already OK.');
}
