// scripts/doctor.mjs
import fs from 'node:fs';
import path from 'node:path';

function ok(msg) { console.log(`✅ ${msg}`); }
function bad(msg) { console.log(`❌ ${msg}`); process.exitCode = 1; }

function isJson(file) {
  try { JSON.parse(fs.readFileSync(file, 'utf8')); return true; }
  catch { return false; }
}

const mustBeJson = [
  'package.json', 'tsconfig.json', 'tsconfig.app.json', 'tsconfig.spec.json',
  'proxy.conf.json', 'angular.json'
];

for (const f of mustBeJson) {
  if (!fs.existsSync(f)) { bad(`${f} is missing`); continue; }
  isJson(f) ? ok(`${f} is valid JSON`) : bad(`${f} is invalid JSON`);
}

// proxy must map /kpis
try {
  const proxy = JSON.parse(fs.readFileSync('proxy.conf.json', 'utf8'));
  if (proxy['/kpis']?.target) ok('proxy.conf.json has /kpis target');
  else bad('proxy.conf.json is missing /kpis target');
} catch {}

const hasServer =
  fs.existsSync(path.join('mock-api', 'server.mjs')) ||
  fs.existsSync(path.join('mock-api', 'server.cjs'));

hasServer ? ok('mock API server found (server.mjs or server.cjs)')
          : bad('mock API server missing at mock-api/server.mjs or server.cjs');

// near the end of doctor.mjs, before printing “Doctor looks good.”
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
try {
  require.resolve('json-server/package.json');
  ok('json-server module resolvable');
} catch {
  bad('json-server not installed or not resolvable (npm i -D json-server)');
}

if (process.exitCode) {
  console.log('\nDoctor found issues. See messages above.');
  process.exit(process.exitCode);
} else {
  console.log('\nDoctor looks good.');
}
