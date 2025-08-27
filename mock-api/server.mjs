#!/usr/bin/env node
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const host = process.env.MOCK_API_HOST || '127.0.0.1';
const port = String(process.env.MOCK_API_PORT || 3001);

// Resolve the local bin cross-platform
const bin =
  process.platform === 'win32'
    ? path.join(process.cwd(), 'node_modules', '.bin', 'json-server.cmd')
    : path.join(process.cwd(), 'node_modules', '.bin', 'json-server');

const args = [
  '--watch', path.join(__dirname, '../mocks/db.json'),
  '--host', host,
  '--port', port,
];

const child = spawn(bin, args, { stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 0));
