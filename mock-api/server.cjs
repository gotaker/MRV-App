#!/usr/bin/env node
// mock-api/server.cjs
const path = require('node:path');
const jsonServer = require('json-server');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, '../mocks/db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Simple CORS (handy if you bypass the Angular proxy)
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

server.use(router);
const host = process.env.MOCK_HOST || '127.0.0.1';
const port = Number(process.env.MOCK_PORT || 3000);

server.listen(port, host, () => {
  console.log(`Mock API listening at http://${host}:${port}`);
});
