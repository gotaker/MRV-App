
/* scripts/apply-proxy.cjs
   Ensure --proxy-config proxy.conf.json is added to npm start
*/
const fs = require('fs');
const PKG = 'package.json';
if (!fs.existsSync(PKG)) {
  console.error('package.json not found');
  process.exit(1);
}
const pkg = JSON.parse(fs.readFileSync(PKG, 'utf8'));
pkg.scripts = pkg.scripts || {};
const start = pkg.scripts.start || 'ng serve';
if (!start.includes('--proxy-config')) {
  pkg.scripts.start = `${start} --proxy-config proxy.conf.json`;
}
fs.writeFileSync(PKG, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
console.log('Updated package.json start script with --proxy-config proxy.conf.json');
