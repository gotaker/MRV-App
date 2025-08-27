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

## Scripts

| Script              | What it does                                                                      |
| ------------------- | --------------------------------------------------------------------------------- |
| `npm start`         | `ng serve` (Angular dev server, Vite-powered)                                     |
| `npm run mock:api`  | Starts the mock API (`json-server`) at `127.0.0.1:3001`                           |
| `npm run start:all` | Runs **both**: mock API + web (via `concurrently`)                                |
| `npm test`          | Jest unit tests                                                                   |
| `npm run format`    | Formats staged files via Prettier                                                 |
| `npm run doctor`    | Validates `angular.json`, `tsconfig*`, `proxy.conf.json`, mock API presence/ports |

> prestart runs the doctor so you get actionable errors before the dev server spins up.
---
## Project layout

.
├─ src/
│  ├─ app/
│  │  ├─ dashboard/           # DashboardComponent (signals, Material cards)
│  │  ├─ kpis/                # KpisService (calls /kpis)
│  │  └─ shared/              # interceptors, GlobalErrorHandler
│  ├─ styles.scss             # uses styles/theme.scss
│  └─ styles/
│     └─ theme.scss           # Angular Material theming (M3)
├─ mocks/
│  └─ db.json                 # mock data for json-server
├─ mock-api/
│  └─ server.mjs              # ESM bootstrapper around json-server
├─ proxy.conf.json            # proxies /kpis -> http://127.0.0.1:3001
├─ angular.json               # CLI configuration (serve uses buildTarget)
├─ tsconfig*.json             # TypeScript configs (root/app/spec)
└─ package.json
---

## Mock API
Implementation: mock-api/server.mjs + mocks/db.json

- **Default: http://127.0.0.1:3001

Env overrides:

- ** MOCK_API_HOST=127.0.0.1
- ** MOCK_API_PORT=3002

If a port is busy, either free it or:
```powershell
$env:MOCK_API_PORT=3002
npm run mock:api
````

## Then adjust `proxy.conf.json` temporarily to match the new port (default is 3001).

## HTTP Proxy (dev)

`proxy.conf.json` routes frontend calls to the mock API so there’s no CORS during development:

```
{
  "/kpis": {
    "target": "http://127.0.0.1:3001",
    "secure": false,
    "changeOrigin": true
  }
}
```

## In the app, always call `/kpis` (relative path).

## Testing

```powershell
npm test
```

- Jest + jest-preset-angular
- Place tests under `src/**/*.spec.ts`

---

## **Commit & formatting**

- Pre-commit: Prettier on staged files (fast & deterministic).
- Commit messages: commitlint (Conventional Commits).
  - Examples: feat(dashboard): show KPI trends, fix(api): handle network errors
    -Pre-push: light/no-op to avoid blocking local work; full linting should run in CI.

---

## Guardrails

`npm run doctor` checks:

- JSON validity: angular.json, proxy.conf.json, tsconfig\*.json
- Angular serve has valid buildTarget (dev-server + application builder)
- Mock API files exist and default port is free

Prestart runs doctor automatically.

## Troubleshooting

- **Blank page / “Angular requires Zone.js”**
  Ensure import 'zone.js' is at the top of src/main.ts.

- **Schema validation errors (tsConfig, buildTarget, main, etc.)**
  Run npm run doctor and follow the guidance. We normalize angular.json to @angular-devkit/build-angular:application and serve → buildTarget.

- **CORS or network errors**
  Use the proxy (/kpis) and ensure the mock API is running. Test http://127.0.0.1:3001/kpis directly.

- **Port already in use**
  Free it or change MOCK_API_PORT and update the proxy temporarily.

- **“Cannot find module 'json-server'”**
  Install it (as dev dep): npm i -D json-server.

## Roadmap

- API integration: swap mock with real endpoints via environment config.
- UI polish: units, deltas, simple trend indicators on KPI cards.
- Error UX: central toast (wired) + “Retry” action on error state.
- E2E: add a Cypress smoke test using the mock API.
- CI: npm ci → npm run doctor → npm test → npm run build.
- Releases: semantic commits + auto-generated CHANGELOG.md.

## License

MIT
