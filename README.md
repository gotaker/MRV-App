# MRV App (Angular 20)

A small, modern Angular 20 app that displays KPIs with a fast local dev loop and a built-in mock API.

## Tech stack

- **Angular 20** (standalone APIs, signals, Angular Material)
- **Node 22.12.0** (pinned)
- **Angular CLI / Vite dev server**
- **Mock API**: `json-server` (ESM), launched from `mock-api/server.mjs`
- **Testing**: Jest + `jest-preset-angular`
- **Formatting**: Prettier via `lint-staged`
- **Git hooks**: Husky (light pre-commit + commitlint)
- **Guardrails**: `npm run doctor` (validates key JSON/config + mock API presence)

---

## Quick start

> Windows/PowerShell shown; macOS/Linux equivalent commands work the same.

````powershell
# 1) Use the pinned Node version
nvm use 22.12.0

# 2) Install dependencies
npm ci

# 3) Start both servers (web + mock API)
npm run start:all
# Web: http://127.0.0.1:4200/
# API: http://127.0.0.1:3001/kpis
---
