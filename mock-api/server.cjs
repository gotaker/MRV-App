#!/usr/bin/env node
/* eslint-disable no-console */
const jsonServer = require('json-server');
const path = require('node:path');

const host = process.env.MOCK_API_HOST || '127.0.0.1';
const port = Number(process.env.MOCK_API_PORT || 3001);

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, '../mocks/db.json'));
const middlewares = jsonServer.defaults();

// very permissive CORS for local dev
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  next();
});

server.use(middlewares);
// mount router (you can add custom routes/middleware above)
server.use(router);

function listen(p) {
  server.listen(p, HOST, () => {
    console.log(`Mock API listening at http://${HOST}:${p}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${p} in use, retrying ${p + 1}...`);
      listen(p + 1);
    } else {
      console.error(err);
      process.exit(1);
    }
  });
}
