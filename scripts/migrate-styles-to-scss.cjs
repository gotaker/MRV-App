/* migrate-styles-to-scss.cjs */
const fs = require('fs');

const ANGULAR = 'angular.json';
if (!fs.existsSync(ANGULAR)) {
  console.error('angular.json not found');
  process.exit(0);
}
const json = JSON.parse(fs.readFileSync(ANGULAR, 'utf8'));

const replaceCssWithScss = (stylesArr) => {
  if (!Array.isArray(stylesArr)) return;
  for (let i = 0; i < stylesArr.length; i++) {
    const v = stylesArr[i];
    const p = typeof v === 'string' ? v : v?.input;
    if (typeof p === 'string' && p.endsWith('src/styles.css')) {
      if (typeof v === 'string') stylesArr[i] = 'src/styles.scss';
      else stylesArr[i].input = 'src/styles.scss';
    }
  }
};

const projects = json.projects || {};
for (const name of Object.keys(projects)) {
  const p = projects[name];
  const build = p?.architect?.build?.options;
  const test  = p?.architect?.test?.options;
  if (build?.styles) replaceCssWithScss(build.styles);
  if (test?.styles)  replaceCssWithScss(test.styles);
  const build2 = p?.targets?.build?.options;
  const test2  = p?.targets?.test?.options;
  if (build2?.styles) replaceCssWithScss(build2.styles);
  if (test2?.styles)  replaceCssWithScss(test2.styles);
}

fs.writeFileSync(ANGULAR, JSON.stringify(json, null, 2) + '\n', 'utf8');
console.log('angular.json updated: styles.css -> styles.scss');
