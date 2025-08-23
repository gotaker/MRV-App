# MRV App (Container-ready)

A modernized MRV (Monitoring, Reporting & Verification) web app for GHG emissions, upgraded to **Angular 20**, **Material 3**, **ESLint flat config**, **Jest** unit tests, **Cypress** e2e (optional), and production-grade **Docker**/**Nginx** deployment. Includes an Angular dev-server proxy for `/api` to eliminate CORS in development, and an Nginx reverse proxy for `/api` in production.

## Table of contents
- [Requirements](#requirements)
- [Quick start (dev)](#quick-start-dev)
- [API proxy in development](#api-proxy-in-development)
- [Material 3 theming](#material-3-theming)
- [Scripts](#scripts)
- [Linting & formatting](#linting--formatting)
- [Unit tests (Jest)](#unit-tests-jest)
- [E2E tests (Cypress)](#e2e-tests-cypress)
- [Local HTTPS (optional)](#local-https-optional)
- [Docker (production)](#docker-production)
- [CI/CD](#cicd)
- [Project structure](#project-structure)
- [Conventional commits & changelog](#conventional-commits--changelog)
- [Security, contributing & codeowners](#security-contributing--codeowners)
- [Troubleshooting](#troubleshooting)

---

## Requirements
- **OS**: Windows, macOS or Linux
- **Node.js**: **22.12.0** (pinned)  
  Angular 20 toolchain requires Node `^20.19.0 || ^22.12.0 || >=24.0.0`. We standardize on **22.12.0**.
- **npm**: 10.x (bundled with Node 22)
- **Docker**: for container builds and e2e (optional)
- **Git**

> Windows + network/mapped drives: we enable file watching with polling to avoid missed rebuilds.

---

## Quick start (dev)

```bash
# 1) Install deps
npm ci

# 2) (Recommended on Windows/network drives)
#    Force polling so Vite/HMR sees changes reliably
#    PowerShell:
$env:CHOKIDAR_USEPOLLING="1"
#    bash:
export CHOKIDAR_USEPOLLING=1

# 3) Start Angular dev server (HTTP, port 4200)
npm start
# This runs: ng serve --proxy-config proxy.conf.json --host 127.0.0.1 --port 4200

# 4) Open in your browser
http://127.0.0.1:4200/
```

If your backend runs on `http://localhost:3000`, the dev proxy routes frontend requests from `/api/*` → `http://localhost:3000/*` (see [API proxy in development](#api-proxy-in-development)).

---

## API proxy in development

- **Service URL**: frontend calls **`/api/kpis`** (see `src/app/kpis/kpis.service.ts`)
- **Proxy**: `proxy.conf.json`:
  - Proxies `/api/*` → `http://localhost:3000/*`
  - Rewrites `^/api` away before forwarding
- **Dev server** automatically adds `--proxy-config proxy.conf.json` to `npm start`.

> If your API runs elsewhere, update `proxy.conf.json` `target` accordingly.

---

## Material 3 theming

- **Global styles**:
  - `src/styles.scss` imports the M3 theme:
    ```scss
    @use '@angular/material' as mat;
    @use 'src/styles/theme' as *; // src/styles/theme.scss
    ```
  - `src/styles/theme.scss` defines the color system and theme variables, then includes:
    ```scss
    @use '@angular/material' as mat;

    $theme: mat.define-theme((
      color: (
        theme-type: light,
        primary: mat.$blue-palette,
        tertiary: mat.$pink-palette,
      ),
      typography: (),
      density: (scale: 0)
    ));

    :root { @include mat.theme-vars($theme); }
    ```
- **Angular Material** components inherit the M3 theme tokens.  
- To add **dark mode**, define another `$theme-dark` and toggle the CSS scope (e.g., `.dark { @include mat.theme-vars($theme-dark); }`).

---

## Scripts

`package.json` (highlights):
- `npm start` — dev server with proxy (`ng serve --proxy-config proxy.conf.json`)
- `npm run build` — production build (`ng build --configuration production`)
- `npm run lint` — ESLint (flat config)
- `npm test` — Jest unit tests (ts-jest, jest-preset-angular)
- `node scripts/tag-version.cjs <version>` — build **Docker** image tagged with the provided version plus `latest`

---

## Linting & formatting
- **ESLint 9 flat config** for Angular + TS + templates
- Run:
  ```bash
  npm run lint
  ```
- Many rules support `--fix`. Pre-commit hooks can run lint on staged files.

---

## Unit tests (Jest)

- Stack: **jest** + **ts-jest** + **jest-preset-angular** (Angular 20 compatible)
- Run all tests with coverage:
  ```bash
  npm test -- --config=jest.config.cjs --passWithNoTests --coverage
  ```
- `src/test-setup.ts` sets up Angular testing environment + zone.js.

---

## E2E tests (Cypress)

We provide a Dockerized Cypress runner that:
- Waits for `web` on port `4200`
- Uses `CYPRESS_baseUrl=http://web:4200` within the compose network

Run e2e (example, if `docker-compose.e2e.yml` present):
```bash
docker compose -f docker-compose.e2e.yml up --build --abort-on-container-exit
```

> Ensure your app is reachable from within the compose network (service name `web` or adjust `baseUrl`).

---

## Local HTTPS (optional)
The dev server runs HTTP by default. If you need HTTPS locally:

```bash
# Generate a self-signed cert (OpenSSL)
mkdir certs
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -days 365   -keyout certs/localhost.key   -out certs/localhost.crt   -subj "/CN=localhost"

# Serve with TLS
npx ng serve --host 127.0.0.1 --port 4200   --ssl true --ssl-cert ./certs/localhost.crt --ssl-key ./certs/localhost.key
```

> If your browser auto-upgrades to HTTPS while the server is running **HTTP**, you’ll see `SSL_ERROR_RX_RECORD_TOO_LONG`. Make sure the `--ssl` flags match the URL you open.

---

## Docker (production)

We ship a multi-stage **Dockerfile** and a minimal **Nginx** runtime.

**Build & run locally:**
```bash
# Build versioned image
node scripts/tag-version.cjs 20.1.0

# OR compose
docker compose -f docker-compose.prod.yml up --build -d

# Open Nginx (serves dist/ and proxies /api -> API_ORIGIN)
http://localhost:8080
```

**Key files:**
- `Dockerfile.prod` — Node builder → Angular prod build → Nginx runtime
- `ops/nginx/default.conf.template` — SPA hosting + `/api` reverse proxy + security headers
- `ops/entrypoint.sh` — env-substitution for `API_ORIGIN`/`SERVER_NAME`
- `docker-compose.prod.yml` — local runner mapping port `8080`

> Set `API_ORIGIN` (e.g., `http://api:3000` or `https://api.example.com`) at runtime.

---

## CI/CD
**GitHub Actions**:
- `.github/workflows/ci.yml` — CI: install, lint, test, build
- `.github/workflows/docker.yml` — On git tag `v*.*.*`:
  - Build & push `ghcr.io/<org>/<repo>/mrv-web:<tag>` and `:latest`

> For AWS deployment, use S3+CloudFront (static) or ECS Fargate (container). We can provide Terraform/CDK on request.

---

## Project structure

```
.
├─ src/
│  ├─ app/
│  │  ├─ kpis/
│  │  │  ├─ kpis.service.ts          # uses /api/kpis (dev: proxy, prod: nginx proxy)
│  │  │  └─ kpis.service.spec.ts     # Jest unit tests
│  │  ├─ dashboard/
│  │  │  └─ dashboard.component.ts   # Signal-based state (loading/ok/err)
│  │  ├─ app.component.ts
│  │  ├─ app.routes.ts
│  │  └─ dev-kpi.interceptor.ts      # (optional) mock data for offline dev
│  ├─ styles.scss
│  └─ styles/theme.scss
├─ proxy.conf.json                    # dev /api proxy -> http://localhost:3000
├─ Dockerfile.prod
├─ docker-compose.prod.yml
├─ ops/
│  ├─ entrypoint.sh
│  └─ nginx/default.conf.template
├─ scripts/
│  ├─ tag-version.cjs
│  └─ (other helper scripts)
├─ README.md
├─ UPGRADE_PLAN.md
├─ CHANGELOG.md
├─ COMMIT_PLAN.md
├─ CONTRIBUTING.md
├─ SECURITY.md
└─ CODEOWNERS
```

---

## Conventional commits & changelog

We follow **Conventional Commits**:

- `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `ci:`, `build:`, `perf:`…
- Scopes encouraged (e.g., `feat(theme): …`, `fix(dev): …`)
- `CHANGELOG.md` is maintained alongside PRs.

**Examples:**
```
feat(theme): introduce Material 3 light theme with primary/tertiary tokens
fix(dev): proxy /api to backend and route service via /api/kpis to resolve CORS
chore(prod): add multi-stage Dockerfile with Nginx SPA fallback and /api reverse proxy
```

---

## Security, contributing & codeowners

- **Security**: see `SECURITY.md` for reporting vulnerabilities and supported versions.
- **Contributing**: `CONTRIBUTING.md` covers environment setup, lint/test requirements, and PR workflow.
- **Codeowners**: `CODEOWNERS` ensures mandatory review from owners for protected paths.

**Rule of thumb**: *Always* open a **PR** for fixes and features. CI must pass (lint, unit tests). E2E optional but recommended for UI regressions.

---

## Troubleshooting

**Blank page / nothing renders**
- Check DevTools → Console for runtime errors.
- Ensure **Zone.js** is imported at the top of `src/main.ts`:
  ```ts
  import 'zone.js';
  ```
  (If opting for **zoneless** Angular, we can reconfigure accordingly.)

**CORS error calling API**
- Use frontend path **`/api/...`**; dev proxy maps to `http://localhost:3000`.
- If your API is not on 3000, update `proxy.conf.json`.
- In production, Nginx proxies `/api` to `API_ORIGIN`.

**SSL error `SSL_ERROR_RX_RECORD_TOO_LONG`**
- Happens when the server is HTTP and you open **https://** (or vice versa).
- For dev, use `http://127.0.0.1:4200/` unless you started `ng serve` with `--ssl ...`.

**Port already in use (4200)**
```powershell
$pid = (Get-NetTCPConnection -LocalPort 4200 -ErrorAction SilentlyContinue | Select-Object -First 1 -Expand OwningProcess)
if ($pid) { Stop-Process -Id $pid -Force }
```

**Windows network/mapped drive changes don’t trigger rebuild**
- Use polling:
  ```powershell
  $env:CHOKIDAR_USEPOLLING="1"; npm start
  ```

**ESLint config errors**
- We use ESLint **flat config**. Ensure imports in `eslint.config.js` use the correct style (CJS vs ESM). The repo is ESM; CommonJS plugins should be imported as default and destructured if needed.

**Jest complains about TypeScript or ESM**
- We use `jest.config.cjs` to avoid ESM issues.
- If you see `TS151001`, ensure `esModuleInterop` is enabled in `tsconfig.spec.json` or the main `tsconfig.json` (if required by a library).

---

## Support / next steps

- Pick your **AWS** deployment path (S3+CloudFront or ECS Fargate) and we’ll add infra + deployment workflows.
- Add **dark theme** and theme toggling.
- Add **observability** (Sentry or CloudWatch RUM) and **performance budgets**.
- Expand Cypress e2e for critical user journeys.

---

### ✅ Commit message for this change
```
docs(readme): rebuild comprehensive README covering dev/prod, proxy, M3 theming, Docker/Nginx, CI, and troubleshooting
```
