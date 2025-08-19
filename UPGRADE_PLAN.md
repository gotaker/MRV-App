# UPGRADE PLAN — Angular 20 + Material 3

This plan documents the refactor from the legacy MRV app to a modern Angular 20 stack with Material 3, stable tooling, and production deploys.

## Goals

1. Upgrade framework & deps to **Angular 20.1.x** with **Material 3**.
2. Modernize tooling: **ESLint 9 flat**, **Prettier**, **Husky v10**, **Jest 29**, **Cypress 13**.
3. Containerize dev & tests; add **image versioning** + GHCR publish.
4. Improve UX (M3 theme, dark mode) and runtime config for API.
5. CI/CD to **S3 + CloudFront** (HTTPS/HSTS) via GitHub OIDC.

## Scope

- App: Angular 20 standalone components; signals-friendly.
- Theming: Material 3 default palettes + custom typography.
- Lint: Angular ESLint flat presets; selector conventions.
- Tests: Jest 29 for unit (CLI-compatible); Cypress 13 e2e.
- Docker: dev server, mock-api via `json-server`, e2e runner (Node 22), SSL for dev.
- Versioning: OCI labels, compose overlays, GHCR workflow.
- Security: CODEOWNERS, SECURITY.md, Dependabot (if configured).

## Detailed Steps

### 1) Framework & Core Deps

- `@angular/*` → `20.1.x`
- `zone.js` → `^0.15.1`
- `rxjs` → latest 7.8.x compatible
- Material 3 theme scaffold, use `mat.define-theme` with default M3 palettes.

### 2) Lint & Format

- Replace legacy config with `eslint.config.js` (flat):
  - `@eslint/js`, `typescript-eslint`, `angular-eslint`
  - Enable `processInlineTemplates`
  - Selector rules: directives (attribute `app*` camelCase), components (element `app-*` kebab-case)
- Prettier, lint-staged, Husky v10 (`"prepare": "husky"`).

### 3) Unit Tests

- Pin to **Jest 29** (Angular CLI’s peerOptional).
- `jest.config.ts` uses `preset: 'jest-preset-angular'`, `testEnvironment: 'jsdom'`.
- Update `test-setup`; migrate deprecated APIs if any.
- Typed specs; migrate from deprecated HttpClientTestingModule → `provideHttpClient()` + `provideHttpClientTesting()`.

### 4) E2E Tests

- Cypress 13 setup:
  - `cypress.config.ts`, `cypress/e2e/*`, `cypress/support/e2e.ts`
- Dockerized e2e:
  - `Dockerfile.e2e` (Node 22)
  - `docker-compose.e2e.yml` with **wait-on** baseUrl
  - HTTPS variants supported

### 5) Dev & Mock API

- `docker-compose.yml`:
  - `web`: `Dockerfile.dev` (Node 22), bind mounts
  - `mock-api`: `clue/json-server:latest`, map `3000:80`, mount `./mock/db.json`
- Optional SSL in dev: `certs` mount + `ng serve --ssl`

### 6) Runtime Config

- `API_BASE_URL` injection token reads `window.__API_BASE_URL__`, defaults to `http://localhost:3000`.

### 7) Image Versioning & CI Publish

- `.env.example`, `scripts/update-env.mjs` to sync `APP_VERSION`, `GIT_COMMIT`, `BUILD_DATE`.
- `docker-compose.version.yml` overlay
- OCI labels in Dockerfiles
- `.github/workflows/docker-publish.yml` pushes `*-web` and `*-e2e` to GHCR

### 8) CI/CD to AWS

- Configure IAM role for GitHub OIDC.
- Secrets: `AWS_DEPLOY_ROLE_ARN`, `AWS_REGION`, `S3_BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID`.
- Workflows for build/test and deploy (S3 sync + CloudFront invalidation).

## Acceptance Criteria

- `npm ci && npm run lint && npm test` pass locally on Node >=20.19.
- `docker compose up --build` serves app & mock API.
- `docker compose -f docker-compose.yml -f docker-compose.e2e.yml up --build e2e` runs green (after wait-on).
- Material 3 theme renders; dark mode toggle works.
- KPIs load from mock API; dashboard shows data.
- GHCR workflow builds & pushes versioned images.
- S3 + CloudFront deploy serves app via HTTPS.

## Risks / Mitigations

- **Peer conflicts** (Jest 30 vs CLI): pin Jest to 29.x until CLI supports 30.
- **Engine constraints**: ensure Node >=20.19 locally; e2e runner uses Node 22.
- **SSL in dev**: mkcert recommended; document OpenSSL alternative.
- **Rule names**: rely on Angular recommended presets to avoid drift.

## Rollback Plan

- Keep previous tags/branches; revert via git tag/branch.
- Docker images are versioned; switch tag to previous version in compose or deploy.

## Timeline (suggested)

- Day 1–2: Framework, lint stack, Docker dev, mock API
- Day 3: Material 3 baseline; runtime config; KPIs service
- Day 4: Jest unit tests; Cypress setup
- Day 5: E2E Docker runner; wait-on; CI publish to GHCR
- Day 6: AWS deploy wiring; docs & polish
