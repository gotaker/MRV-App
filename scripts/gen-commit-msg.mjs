#!/usr/bin/env node
// scripts/gen-commit-msg.mjs
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';

const [msgFile, source] = process.argv.slice(2);
if (!msgFile) process.exit(0);

// If user supplied -m / merge / rebase message, don't override
if (source && source !== 'message') process.exit(0);

const current = fs.existsSync(msgFile) ? fs.readFileSync(msgFile, 'utf8').trim() : '';
if (current) process.exit(0); // message already present

// Find staged files
let files = [];
try {
  const out = execSync('git diff --staged --name-only', { encoding: 'utf8' }).trim();
  files = out ? out.split('\n').filter(Boolean) : [];
} catch {
  // no staged files or not a git repo
  process.exit(0);
}
if (files.length === 0) process.exit(0);

// Guess type and scope
const classify = (f) => {
  if (/\.spec\.ts$/.test(f)) return 'test';
  if (/^src\/app\//.test(f)) return 'feat';
  if (/^src\/styles?\/|\.scss$/.test(f)) return 'style';
  if (/^(angular\.json|tsconfig|eslint|\.husky|\.github|package(-lock)?\.json)/.test(f)) return 'build';
  if (/^mocks\/|^mock-api\/|^proxy\.conf\.json$/.test(f)) return 'chore';
  return 'chore';
};

const types = new Set(files.map(classify));
const type = types.has('feat') ? 'feat'
           : types.has('fix') ? 'fix'
           : types.has('build') ? 'build'
           : types.has('style') ? 'style'
           : types.has('test') ? 'test'
           : 'chore';

let scope = '';
const appFile = files.find((f) => f.startsWith('src/app/'));
if (appFile) {
  const segs = appFile.split('/');
  scope = segs[2] || ''; // src/app/<scope>/...
} else {
  scope = (files[0] || '').split('/')[0] || '';
  scope = scope.replace(/\.(json|md|ya?ml|c?m?js)$/i, '');
}

const summaryParts = [];
const tops = [...new Set(files.map((f) => f.split('/')[0]))].slice(0, 3);
if (tops.length) summaryParts.push(`update ${tops.join(', ')}`);
const summary = summaryParts.join(' ') || `update ${files.length} file(s)`;

// Compose conventional commit
const header = scope ? `${type}(${scope}): ${summary}` : `${type}: ${summary}`;
const bullets = files.slice(0, 10).map((f) => `- ${f}`).join('\n');
const more = files.length > 10 ? `\n- …and ${files.length - 10} more` : '';

const body = bullets ? `\n\n${bullets}${more}\n` : '\n';
fs.writeFileSync(msgFile, `${header}${body}`, 'utf8');
