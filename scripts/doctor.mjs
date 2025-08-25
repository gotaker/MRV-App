#!/usr/bin/env node
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';

const root = process.cwd();

function readJson(file) {
  const p = path.join(root, file);
  try {
    const txt = fs.readFileSync(p, 'utf8');
    const json = JSON.parse(txt);
    console.log(`✅ ${file} is valid JSON`);
    return json;
  } catch (e) {
    console.error(`❌ ${file} is invalid JSON:\n${e.message}`);
    process.exitCode = 1;
    return null;
  }
}

function fileExists(file, label = file) {
  const p = path.join(root, file);
  if (fs.existsSync(p)) {
    console.log(`✅ ${label} found`);
    return true;
  }
  console.error(`❌ ${label} missing at ${file}`);
  process.exitCode = 1;
  return false;
}

function portFree(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const srv = net.createServer().once('error', () => resolve(false)).once('listening', () => {
      srv.close(() => resolve(true));
    }).listen(port, host);
  });
}

(async () => {
  readJson('package.json');
  const tsconfig = readJson('tsconfig.json');
  readJson('tsconfig.app.json');
  readJson('tsconfig.spec.json');
  const proxy = readJson('proxy.conf.json');
  const ng = readJson('angular.json');

  // Angular serve builder/target check
  if (ng?.projects) {
    const [projectName] = Object.keys(ng.projects);
    const proj = ng.projects[projectName];
    const serve = proj?.architect?.serve;
    const build = proj?.architect?.build;
    const serveBuilder = serve?.builder || '';
    const buildBuilder = build?.builder || '';

    const needsBuildTarget = serveBuilder.endsWith(':dev-server') && buildBuilder.endsWith(':application');
    const needsBrowserTarget = serveBuilder.endsWith(':dev-server') && buildBuilder.endsWith(':browser');

    const hasBuildTarget =
      serve?.options?.buildTarget && serve?.configurations?.development?.buildTarget && serve?.configurations?.production?.buildTarget;
    const hasBrowserTarget =
      serve?.options?.browserTarget && serve?.configurations?.development?.browserTarget && serve?.configurations?.production?.browserTarget;

    if (needsBuildTarget && !hasBuildTarget) {
      console.error('❌ angular.json: serve.* must set buildTarget for :dev-server + :application builders');
      process.exitCode = 1;
    }
    if (needsBrowserTarget && !hasBrowserTarget) {
      console.error('❌ angular.json: serve.* must set browserTarget for :dev-server + :browser builders');
      process.exitCode = 1;
    }
  }

  // proxy shape check
  if (proxy && typeof proxy === 'object') {
    const kpis = proxy['/kpis'];
    if (!kpis || !kpis.target) {
      console.error('❌ proxy.conf.json: missing "/kpis" or "target"');
      process.exitCode = 1;
    } else {
      console.log('✅ proxy.conf.json has /kpis target');
    }
  }

  // mock API assets
  fileExists('mock-api/server.cjs', 'mock API server');
  fileExists('mocks/db.json', 'mock DB');

  // port check
  const free = await portFree(Number(process.env.PORT || 3001));
  if (!free) {
    console.error('❌ PORT 3001 is already in use for mock API. Change the PORT env or stop the other process.');
    process.exitCode = 1;
  } else {
    console.log('✅ Mock API default port 3001 is free');
  }

  process.exit(process.exitCode || 0);
})();
