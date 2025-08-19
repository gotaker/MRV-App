# MRV App — Original vs. Upgrade Plan (Analysis Report)

_Date: 2025-08-19 03:06:07Z UTC_

This report summarizes the attached original app (zip) and compares it with our Angular 20 + Material 3 upgrade plan and current progress.

## Snapshot of the Original App

**Structure**
- `Frontend/` — Angular application (no `angular.json`/`package.json` present in the archive, but full `src/`)
- `Backend/` — Node/Express + Mongoose snippets (models/controllers/routes) with MongoDB config
- `Frontend/Misc/` — many `.bson` + `.metadata.json` files (typical **mongodump** artifacts for seed data)

**Frontend Findings**
- Components: **many**; Services: **many**
- Ivy disabled in `tsconfig.app.json` → indicates **pre-Ivy Angular (v7/v8)** era
- Uses legacy Angular Material **barrel import** (`@angular/material`)
- Third-party UI libs: CoreUI, ngx-bootstrap, ng2-charts, ag-grid
- Router uses **HashLocationStrategy**
- Guards and an HTTP interceptor present

**Backend Findings**
- Partial Express/Mongoose structure present but **no runnable entrypoint/manifests** in the archive

**Seed Data**
- BSON/metadata likely to seed domain data.

## Upgrade Plan (Recap)

- **Front-end**: Angular **20.1.x**, **Material 3**, standalone components, signals, ESLint 9 (flat), Prettier.
- **Tooling**: Jest 29 (CLI 20 compatibility), Cypress 13, Dockerized dev & e2e, SSL in dev.
- **Ops**: Image versioning with OCI labels + GHCR; S3 + CloudFront deploy w/ ACM.
- **Runtime config**: `API_BASE_URL` token (reads `window.__API_BASE_URL__`).

## Progress vs Plan (Status)

| Area | Original | Target | Status |
|---|---|---|---|
| Angular Core | pre-Ivy | 20.1.x | ✅ Upgraded; app boots with M3 |
| Material | `@angular/material` barrel | Material **3** | ✅ Baseline M3 theme added |
| Routing | Hash strategy | PathLocationStrategy, lazy | ⚠️ Partially migrated |
| State | Service-based | Signals + unions | ✅ Dashboard uses signals |
| Lint | TSLint/legacy | ESLint 9 flat | ✅ Configured; issues resolved |
| Testing (unit) | Jasmine/Karma | **Jest 29** | ✅ Config in place |
| E2E | Protractor legacy | **Cypress 13** | ✅ Docker runner (Node 22) + **wait-on** |
| Dev SSL | Not documented | `ng serve --ssl` | ✅ Supported (certs volume) |
| Mock API | none/unknown | json-server container | ✅ Provided; via compose |
| Versioning | none | OCI labels + GHCR | ✅ Compose overlay + workflow |
| Backend | Express + Mongoose (incomplete) | External API / future service | ⏳ Out of current scope |

## Gaps / Migration Considerations

1. Replace CoreUI/ngx-bootstrap with **Material 3** components.
2. Decide on grid/charts under M3 (CDK Table or MDC Data Table; Chart.js wrapper or ngx-charts).
3. Re-implement guards/interceptors with `provideHttpClient()` + `withInterceptors()`.
4. Move to path-based routing with proper SPA rewrites (CloudFront/Nginx).
5. Convert BSON dumps into a **mongorestore** pipeline for the backend service or JSON fixtures for the mock API.

## Recommended Next Steps

- Lock MVP routes and migration order (feature-by-feature).
- Add unit/e2e coverage per migrated feature.
- Establish auth flow; unify error handling patterns.
- If backend is required, create a separate NestJS/Express service with Mongo and import the BSON seed.
