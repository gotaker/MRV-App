// usage: node scripts/tag-version.cjs 20.1.0
const { execSync } = require('node:child_process');
const v = process.argv[2];
if (!v) {
  console.error('Usage: node scripts/tag-version.cjs <version>');
  process.exit(1);
}
execSync(`docker build -f Dockerfile.prod -t mrv-web:${v} .`, { stdio: 'inherit' });
execSync(`docker tag mrv-web:${v} mrv-web:latest`, { stdio: 'inherit' });
console.log(`Tagged mrv-web:${v} and mrv-web:latest`);
