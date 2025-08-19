// Sync .env with package.json version, git commit, and build date.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

const pkg = JSON.parse(readFileSync('package.json','utf8'));
const version = pkg.version;

let commit = 'dev';
try { commit = execSync('git rev-parse --short HEAD', {stdio:['ignore','pipe','ignore']}).toString().trim(); } catch {}
const buildDate = new Date().toISOString();

const envPath = '.env';
let env = existsSync(envPath) ? readFileSync(envPath,'utf8') : readFileSync('.env.example','utf8');

function setKV(src, key, value) {
  const rx = new RegExp(`^${key}=.*$`, 'm');
  if (rx.test(src)) return src.replace(rx, `${key}=${value}`);
  const suffix = src.endsWith('\n') ? '' : '\n';
  return src + `${suffix}${key}=${value}\n`;
}

env = setKV(env, 'APP_VERSION', version);
env = setKV(env, 'GIT_COMMIT', commit);
env = setKV(env, 'BUILD_DATE', buildDate);

writeFileSync(envPath, env);
writeFileSync('VERSION', version + '\n');
console.log(`[versioning] APP_VERSION=${version} GIT_COMMIT=${commit} BUILD_DATE=${buildDate}`);
