#!/usr/bin/env node
// mock-api/server.mjs
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load json-server robustly (ESM-only in v1 beta)
async function loadJsonServer() {
  const candidates = [
    'json-server',                  // normal
    'json-server/index.js',         // some installs expose this
    'json-server/dist/index.js'     // fallback
  ];
  for (const id of candidates) {
    try {
      const mod = await import(id);
      return mod.default ?? mod;
    } catch { /* try next */ }
  }
  console.error('❌ Could not load "json-server". Try: npm i -D json-server');
  process.exit(1);
}

const jsonServer = await loadJsonServer();

/* Config */
const HOST = process.env.MOCK_API_HOST || '127.0.0.1';
const PORT = Number(process.env.MOCK_API_PORT || 3001);

/* Server */
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, '../mocks/db.json'));
const middlewares = jsonServer.defaults();

// Permissive CORS for local dev
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  next();
});

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(router);

server.listen(PORT, HOST, () => {
  console.log(`Mock API listening at http://${HOST}:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is in use. Either stop the other process or run with MOCK_API_PORT=<freePort>.`);
  } else {
    console.error(err);
  }
  process.exit(1);
});
