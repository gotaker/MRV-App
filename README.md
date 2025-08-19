# MRV — Angular 20 + Material 3

Production-ready starter for the MRV app on **Angular 20**, **Material 3**, **ESLint 9 (flat)** with `angular-eslint` + `typescript-eslint`, **Prettier**, **Husky v10**, **Jest 29** (CLI-compatible), **Cypress 13** e2e (Node 22 runner in Docker), **Docker** for dev and tests, **image versioning** (OCI labels, GHCR), and **AWS S3 + CloudFront** deploys.

> Policy: for **issues and bug fixes always create a PR**. Use Conventional Commits.

---

## Requirements

- **Node**: >= **20.19.0** (local). For e2e container we use **Node 22**.
- **npm**: 10+
- **Angular 20 peer**: `zone.js` **~0.15** (repo pins `^0.15.1`)
- Optional: Docker 24+, GitHub CLI `gh`

---

## Quick Start (local)

```bash
nvm use 20.19.0 || volta install node@20.19.0
npm ci
npm start   # http://localhost:4200 or https://localhost if SSL enabled
```

Build & test:

```bash
npm run lint
npm test
npm run build:prod
```

---

## Local Dev with Docker

```bash
docker compose up --build
# web: http://localhost:4200
# mock-api: http://localhost:3000
```

Mock API uses `clue/json-server:latest` and serves on container port 80 mapped to host 3000. Data file: `./mock/db.json`.

Compose v2 note: **No** top-level `version:` key.

---

## HTTPS (Dev) + Production TLS

### Dev HTTPS

- Generate certs into `./certs` (not committed):
  - mkcert:
    ```bash
    mkcert -install
    mkcert -key-file certs/dev-key.pem -cert-file certs/dev-cert.pem "localhost"
    ```
  - OpenSSL:
    ```bash
    openssl req -x509 -newkey rsa:2048 -nodes -days 365       -keyout certs/dev-key.pem -out certs/dev-cert.pem -subj "/CN=localhost"
    ```
- Compose maps `443:4200` and runs `ng serve` with `--ssl --ssl-cert /app/certs/dev-cert.pem --ssl-key /app/certs/dev-key.pem`.

### Production HTTPS (recommended)

- **S3 + CloudFront** with **ACM** (us-east-1) cert.
- CloudFront: Redirect HTTP→HTTPS, set HSTS response headers (managed policy), use Origin Access Control (OAC) for S3.

(Alt containerized prod: `scripts/nginx-ssl.conf` supplied; mount certs at `/etc/nginx/certs/`.)

---

## Linting (ESLint 9, flat)

- Config: `eslint.config.js` using `@eslint/js`, `typescript-eslint`, `angular-eslint` flat presets.
- Inline template linting enabled via `angular.processInlineTemplates`.
- Selector rules enforced:
  - directives: attribute `app*` camelCase
  - components: element `app-*` kebab-case

Run:

```bash
npm run lint
```

---

## Tests

### Unit (Jest 29)

Angular CLI 20 currently peers Jest 29, so we pin to 29.x for compatibility.

```bash
npm test
```

### E2E (Cypress 13, Docker overlay)

- Files: `cypress.config.ts`, `cypress/e2e/*`, `cypress/support/e2e.ts`
- Use the Node 22 runner and **wait-on** so cypress starts after the dev server is reachable.

Run:

```bash
# build and run only e2e (will wait for web:4200)
docker compose -f docker-compose.yml -f docker-compose.e2e.yml up --build e2e
# or with versioned overlay:
docker compose -f docker-compose.yml -f docker-compose.version.yml -f docker-compose.e2e.yml run --rm e2e
```

If dev SSL is enabled:

```yaml
# in docker-compose.e2e.yml
environment:
  - CYPRESS_baseUrl=https://web:4200
  - NODE_TLS_REJECT_UNAUTHORIZED=0
# and change wait-on to https-get://web:4200 if needed
```

---

## Image & Container Versioning

- `.env.example` → copy to `.env`.
- `scripts/update-env.mjs` syncs:
  - `APP_VERSION` from `package.json`
  - `GIT_COMMIT` (short SHA)
  - `BUILD_DATE` (ISO 8601)
  - Writes `VERSION` file
- `docker-compose.version.yml` overlay injects image names/tags + labels.
- Dockerfiles add **OCI labels** (`org.opencontainers.image.*`).

Local:

```bash
node scripts/update-env.mjs
docker compose -f docker-compose.yml -f docker-compose.version.yml up --build web
```

CI:

- `.github/workflows/docker-publish.yml` pushes `*-web` and `*-e2e` images to GHCR on `main`
  - Tags: `<semver>`, `sha-<short>`, `latest` (web)

---

## CI/CD (AWS OIDC deploy)

Secrets:

- `AWS_DEPLOY_ROLE_ARN`, `AWS_REGION`, `S3_BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID`

Workflows:

- `.github/workflows/ci.yml`: lint, test, build
- `.github/workflows/deploy-s3.yml`: build → S3 sync → CloudFront invalidation on `main`

---

## App Notes

- **Runtime API base**: set via `window.__API_BASE_URL__` (default `http://localhost:3000`), provided through `API_BASE_URL` injection token.
- **Dashboard**: renders KPIs from `/kpis`; typed signal state (`{loading|ok|err}` union).
- **Material 3** theme: default M3 palettes + brand/typography; can be customized later with reference palettes.

---

## Troubleshooting

- **ERESOLVE zone.js**: ensure `zone.js@^0.15.1` with Angular 20.1.x.
- **Engine warnings**: Node must be **>=20.19.0**. e2e container uses Node 22.
- **Cypress can’t reach baseUrl**: use the e2e overlay with **wait-on**; ensure `web` is healthy.
- **Lint rule not found**: we extend Angular recommended presets; avoid custom non-existent rule names.

---

## Contributing & PR Policy

- **Always open a PR** (even for fixes).
- Conventional Commits:
  - `feat(material): finalize M3 baseline`
  - `fix(docker): switch mock-api to public image`
  - `chore(test): pin Jest to 29.x`
- Update tests/docs where relevant.

---

## License / Security

- See `SECURITY.md` to report vulnerabilities privately.
