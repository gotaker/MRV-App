# MRV App (Angular 20 + Material 3)
This repo is a working baseline incorporating all fixes : Angular 20, Material 3 theming, typed state w/ Signals, Jest + Cypress, Docker dev + mock API, ESLint flat config, Husky + lint-staged, and Node 22.12.0 pinning.

## Quick start
```bash
# Use Node 22.12.0
nvm use 22.12.0  # or volta pin 22.12.0

npm ci
npm start
# App: http://localhost:4200
# Mock API: http://localhost:3000/kpis
```

## Docker
```bash
docker compose up --build
# web => http://localhost:4200
# mock-api => http://localhost:3000/kpis
# e2e (optional): docker compose run --rm e2e
```

## Tests
```bash
npm run lint
npm test
npm run e2e:run
```
# Mock API + Version Alignment Patch

This patch helps you fix the Angular Material/CDK version mismatch and adds a local `json-server` mock API for `/api/kpis`.

## What it does
- Sets `@angular/material` and `@angular/cdk` to `^20.1.6` to match Angular 20.x.
- Pins `jest-preset-angular` to `^14.6.1` (known-good in this repo).
- Installs `json-server` and `concurrently` as dev dependencies.
- Adds NPM scripts:
  - `mock:api` – runs json-server on `http://127.0.0.1:3000`.
  - `start:all` – runs both the mock API and `ng serve` together.
- Provides sample `mocks/db.json` and `mocks/routes.json`.
- Provides `proxy.conf.json` that routes `/api/*` to the mock server (no CORS).

## How to apply
From your project root (where `package.json` is):

### PowerShell (Windows)
```powershell
powershell -ExecutionPolicy Bypass -File scripts\align-versions-and-mock.ps1
```

### Bash (macOS/Linux/WSL)
```bash
bash scripts/align-versions-and-mock.sh
```

Then run:
```bash
npm run start:all
```
- Web: http://127.0.0.1:4200
- API: http://127.0.0.1:3000/kpis

> Ensure your `KpisService` uses `/api/kpis` (relative) so the Angular dev server proxy handles it.
