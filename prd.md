# MRV App – Deep Analysis & Product Requirements Document (PRD)

**Doc version:** v0.2  
**Date:** Aug 15, 2025  
**Owner:** gagan (Product) / Assistant (Tech Lead & Architect)  
**Scope:** Deep analysis of the uploaded codebase plus a concrete PRD tailored to observed functionality. 

---

## 0) Executive Summary

The uploaded project is a **MEAN-style** application: **Angular Frontend** with a **Node/Express + MongoDB** backend. The frontend contains a comprehensive set of domain modules across GHG inventory sectors (Energy, IPPU, AFOLU, Waste, etc.) with many components, services, and predefined API constants. The backend present in the zip is **partial/minimal** (only `user` CRUD and `database.config.js`), implying the original server implementation is missing from this archive. BSON datasets for emission factors and domain metadata are present under `Frontend/Misc`, suggesting Mongo seed data or exports.

Key implications:
- Frontend expects a **large REST API surface** (e.g., `/ghg/*`, `/menu/*`, `/database/*`, approvals, reports). Those routes are **not** included server-side in this archive.
- Environment points to `http://localhost:3000` (dev) and a public IP (prod). Tokens are stored in `localStorage` and sent as a bearer token via custom header code.
- Architecture and code organization are legacy (Angular with many feature modules, no interceptors by default in the provided snippet), with some compiled artifacts committed into the repo (`views/wtd/dist`).
- No Docker/IaC/CI files in this zip. Backend lacks `server.js/app.js/package.json`. 

This PRD aligns real features discovered in code with a modernized target architecture on AWS and a refactor roadmap.

---

## 1) Repository & Codebase Snapshot (Observed)

**Top-level:**
- `/Backend/app/config/database.config.js` – Mongo connection string `mongodb://localhost:27017/mrv`.
- `/Backend/app/models/user.model.js` – Mongoose schema for users (role, name, email, password, status).
- `/Backend/app/controllers/user.controller.js` – Express handlers for CRUD with basic validation.
- `/Backend/app/routes/user.route.js` – Express routes for `/user` endpoints.
- **Missing:** `server.js`, `app.js`, `package.json`, auth middleware, other domain routes (`/ghg/*`, `/menu/*`, etc.).

**Frontend (Angular):**
- `src/app/app.constants.ts` defines `BASE_URL = environment.apiBasePath` and **>40 REST endpoints** like `/user/login`, `/ghg/report/*`, `/database/*`, `/menu/group`, `/shared/appdata`.
- `src/environments/environment.ts` → dev API: `http://localhost:3000`; prod: `http://103.16.222.141:3000`.
- **Modules:** Dashboard, Theme, Notifications, Widgets, NDC, Database (Energy/IPPU/AFOLU/Waste) components.
- **Services (examples):** login/register/forgot password, approvals, sectoral services (cement, lime, electricity generation), reference approach, POSF, RNAC, etc. These call constants from `app.constants.ts` and use `HttpClient`.
- **Static data:** BSON exports under `Frontend/Misc/` (emission factors, populations, roles, menus, etc.).

**Observed UX/Design choices:**
- `HashLocationStrategy` in `app.module.ts` (hash-based routing).
- `AgGridModule`, `PerfectScrollbar`, extensive custom sector forms & tables.
- Custom headers sent with each request; tokens pulled from `localStorage`.

---

## 2) Functional Footprint (from Code)

The Angular app appears to implement a **National Inventory / MRV** workflow rather than credit issuance. Functional areas:

1. **Authentication & Users**
   - Login/Logout, Register, Forgot/Reset password.
   - User roles and status management (seen via APIs like `/user/updateStatus`).

2. **Menus & App Data**
   - Dynamic menus (`/menu/group`).
   - Shared application data (`/shared/appdata`).

3. **GHG Inventory**
   - Inventory year and fuel taxonomy (`/ghg/inventoryYear`, `/ghg/fuelType`, `/ghg/fuelByFuelType/:id`).
   - Multiple sector modules (Energy, IPPU, AFOLU, Waste) with data entry and tabular displays.
   - Reporting by gas and aggregates (`/ghg/report/gas`, `/ghg/report`).

4. **Databases / Factors**
   - View/import factor datasets and populations (AFOLU, Energy, IPPU GWP, Waste populations).
   - BSON dumps suggest Mongo seed collections for these datasets.

5. **Approvals / Workflow**
   - `my-approvals` module and services for submission/approval flows.

6. **NDC / Climate Finance / Monitoring**
   - Components for NDC sectors/actions and climate project info/monitoring information.

**Not present server-side in this zip:** all `/ghg/*`, `/menu/*`, `/database/*`, `/shared/*` implementations.

---

## 3) Architecture & Design Review

### 3.1 Current Architecture (inferred)
- **Frontend:** Angular (v? – package.json missing), hash routing, multiple feature modules, services calling a REST API at port 3000. Auth token in `localStorage` → attached per‑request by manually creating headers.
- **Backend:** Node.js + Express + Mongoose for MongoDB. Only `user` CRUD is present here, implying full API lives elsewhere (or was omitted).
- **Data:** MongoDB backing store (connection string in `database.config.js`). Domain BSON dumps shipped in repo (unusual placement under `Frontend/`).

### 3.2 Key Issues / Tech Debt
1. **Partial Backend:** Only `user` model/routes present → frontend depends on many missing endpoints.
2. **Security & Auth**
   - Tokens in `localStorage` (susceptible to XSS). No `HttpInterceptor` pattern spotted for auth headers/refresh.
   - No CSRF strategy noted; CORS unknown.
3. **Config Management**
   - Hardcoded `environment.apiBasePath` includes a public IP for prod; no per‑env secret management.
4. **API Design & Consistency**
   - Constants suggest large surface with inconsistent naming conventions (`/ghg/report/gas` vs `/ghg/report`). Lack of versioning (`/api/v1`).
5. **Error Handling & UX**
   - Services build headers ad‑hoc; no centralized error handling, retries, or toast notifications policy observed.
6. **Repository Hygiene**
   - Built artifacts committed (`views/wtd/dist/*`). BSON under Frontend suggests mixed concerns.
7. **Observability & Ops**
   - No health/readiness endpoints in visible server code; no logging/metrics/tracing setup.
8. **Testing**
   - Angular e2e scaffolding exists (`e2e/`), but no backend tests. No CI.
9. **Performance**
   - No evidence of pagination standards, API limits, or caching. Many data grids likely to grow large.
10. **Accessibility / i18n**
   - Not enough evidence of ARIA, a11y standards, or i18n setup.

---

## 4) Target Product (This PRD) – MRV Inventory Platform

### 4.1 Goals
- Deliver a **secure, scalable, and auditable** MRV inventory system aligned with IPCC/GHG Protocol.
- Preserve existing sectoral functionality while **modernizing** architecture, DevEx, and security.
- Provide clear **approval workflows**, **reporting**, and **factor database management**.

### 4.2 Users & Roles
- **Admin:** Manage users/roles, factor catalogs, configurations.
- **Inventory Analyst:** Enter sectoral data, upload/import datasets, run reports.
- **Approver/Supervisor:** Review submissions and approve/reject with comments.
- **Viewer/Auditor:** Read-only access to reports and audit trails.

### 4.3 In Scope (v1)
- Authentication (SSO optional in v1.1), JWT sessions with refresh tokens.
- Sectoral data entry modules (Energy, IPPU, AFOLU, Waste) + calculations (where applicable).
- Factor/parameter databases with versioning and provenance.
- Approval workflow (submit → review → approve) per inventory year/sector.
- Reporting by gas, sector, and aggregates; CSV/PDF exports.
- Audit logging for create/update/approve actions.

### 4.4 Out of Scope (v1)
- Credit issuance/retirements (registry features). 
- IoT ingestion at scale (will support CSV/API bulk in v1; connectors later).

---

## 5) Functional Requirements

**FR-1 Auth & User Management**
- Register, login, logout; password reset via OTP/email; role & status management.
- JWT access + refresh tokens; session revocation; password policy.

**FR-2 Inventory Data Management**
- Create **Inventory Year** and manage sectoral datasets under it.
- CRUD for sectoral forms (Energy subcategories, IPPU, AFOLU, Waste). 
- Bulk upload via CSV/XLSX with schema validation & preview.
- Draft/Submitted/Approved states per sector and year.

**FR-3 Factor & Catalog Management**
- Import/update factor datasets (Energy/AFOLU/IPPU/Waste) with **versioning**, effective dates, and sources.
- Map factors to sector forms; re‑calculate on factor updates with change logs.

**FR-4 Approvals Workflow**
- Submit data for approval; reviewers can comment, request changes, approve.
- Notifications on state transitions; activity timeline per sector/year.

**FR-5 Reporting**
- **Report by Gas** (CO₂, CH₄, N₂O, CO₂e) and by sector; totals with/without LULUCF.
- Exports: CSV, PDF; saved report configurations; public/non-public toggles.

**FR-6 Administration**
- User/role management; menu configuration; application settings.
- Reference data: fuel types, unit libraries, default factors.

**FR-7 Auditability & Lineage**
- Immutable audit log of all changes, approvals, and factor versions applied.
- Data lineage: which factor version and inputs produced a given report.

---

## 6) Non-Functional Requirements

- **Availability:** 99.9% (working hours) with zero data loss on AZ failure.
- **Security:** OWASP ASVS L2; tokens in httpOnly cookies; CORS locked down; CSP headers; input validation server-side.
- **Performance:** P95 API reads < 300 ms; writes < 800 ms; reports generated async for large volumes.
- **Scalability:** 10M+ records across years; background jobs for imports & recalcs.
- **Observability:** `/healthz`, `/readyz`, structured logs, metrics, traces (OpenTelemetry).
- **Compliance:** Audit logs immutable; PII minimized; backups encrypted.
- **Accessibility:** WCAG 2.1 AA.

---

## 7) Target Architecture (AWS)

**Backend** (Option A – Node/NestJS + MongoDB Atlas/AWS DocumentDB; Option B – NestJS + PostgreSQL):
- **API Gateway/ALB → ECS Fargate** (NestJS app) → **DB** (prefer **Aurora Postgres** for relational rigor; or **Mongo Atlas** if staying document‑oriented). 
- **S3** for file uploads (presigned URLs) and factor imports; **SQS** for async imports and recalcs; **Step Functions** for long running workflows.
- **CloudFront + WAF** in front of Angular web app hosted on S3 (static site hosting).
- **Secrets Manager & KMS** for secrets/keys.
- **OpenTelemetry** to Amazon Managed Prometheus/Grafana; CloudWatch logs.

**Frontend**
- Angular 18 + Standalone APIs (or retain modules but upgrade Angular), **HttpInterceptor** for auth and error handling; state mgmt via NgRx or Signals Store.

**Why Postgres?** Many of the data structures (years, sectors, approvals, factor versions) are relational with strong integrity needs and audit trails. If Mongo is retained, add rigorous schema validation (JSON Schema) and transaction usage.

---

## 8) Data Model (High-Level)

- **User (Org scoped)**: id, email, role(s), status, password hash, lastLogin.
- **InventoryYear**: year, status, owner, submittedOn, approvedOn.
- **SectorData**: sector (Energy/IPPU/AFOLU/Waste), form schema version, data payload, state (Draft/Submitted/Approved), attachments, reviewer comments.
- **FactorCatalog**: domain (Energy/AFOLU/IPPU/Waste), version, source, effectiveFrom/To, records[].
- **Report**: type (byGas/bySector), parameters, output snapshot, generatedAt.
- **Menu**: groups/items by role.
- **AuditLog**: actor, action, entity, before/after, timestamp, hashChain.

---

## 9) UX/Design Requirements

- Consistent design system (Angular Material + custom), responsive, dark mode ready.
- Data grids with virtual scrolling, column filters, export.
- Clear state badges (Draft/Submitted/Approved), approval timeline, and diff views on resubmission.
- Global error toasts, inline field validation, help text/tooltips for factors & formulas.

---

## 10) Gaps → Refactor Plan

1. **Rebuild Backend as NestJS**
   - Define `/api/v1` with modules: `auth`, `users`, `inventory`, `sectors`, `factors`, `approvals`, `reports`, `admin`, `menu`.
   - Implement proper models and DTO validation, pagination, filtering, sorting.
   - Add `/healthz` and `/readyz`, structured logging, OpenAPI spec.
2. **Centralize Auth**
   - Move tokens to httpOnly cookies; add refresh flow; create Angular `HttpInterceptor` to attach auth and handle 401/403.
3. **Config & Secrets**
   - Use environment variables + runtime config; remove hardcoded IPs; per‑env config via SSM/Secrets Manager.
4. **API Versioning & Consistency**
   - Standardize naming, pluralization, and resources; enforce OpenAPI schema + contract tests.
5. **Data Management**
   - Move BSON seed data to `/db/seeds/` with proper migration/seeding scripts.
6. **Repo Hygiene & CI/CD**
   - Remove compiled assets; add `.gitignore`; add GitHub Actions (build, test, lint, SAST/SCA, docker build/push to ECR, deploy to ECS).
7. **Observability & Security**
   - Add OTel, metrics, traces, request ids; CSP; Helmet; rate limits; WAF rules.
8. **Testing**
   - Unit tests (Jest/Vitest), E2E (Playwright/Cypress), contract tests (Pact), API smoke tests.
9. **Performance**
   - Add pagination to all list endpoints; server‑side filtering; caching for reference data; CDN for static.

---

## 11) Milestones & Timeline (Indicative)

- **M0 (1 week):** Repo re‑org, lint/format, Angular upgrade plan, backend scaffolding, OpenAPI draft, infra bootstrap (Terraform).
- **M1 (3–4 weeks):** Auth, users, menus, appdata, factor catalog CRUD + imports, inventory year & sector schemas.
- **M2 (3–4 weeks):** Sector data entry + approvals, reporting (by gas/sector), exports, audit log.
- **M3 (2 weeks):** Hardening (security, perf), observability, blue/green deploy, runbooks.

---

## 12) Acceptance Criteria (Examples)

- Login with role-based menu; token managed via cookies; refresh without page reload.
- Create Inventory Year, populate sector data (Energy), submit for approval, reviewer approves; audit entries recorded.
- Import factor catalog v2025.1; re‑compute report by gas; see delta vs v2024.4.
- `/healthz` and `/readyz` return 200; dashboards show P95 latencies within SLOs.

---

## 13) Open Questions

1. Keep Mongo or move to Postgres? (Impact on existing BSON datasets and queries.)
2. Which identity provider (Okta/Azure AD/Google) is preferred for SSO in v1.1?
3. Do we need multilingual UI? If yes, which locales first?
4. Any data residency constraints? (EU vs US hosting.)
5. Expected size of factor datasets and historical years to support at launch.

---

## 14) Deliverables

- **PRD (this doc)** kept in repo under `/docs/prd.md`.
- **System Design Doc** with diagrams, ERD, sequence flows.
- **OpenAPI 3.1 spec** for `/api/v1`.
- **Terraform** for AWS infra; GitHub Actions pipelines; ECS task defs; service autoscaling; CloudFront + WAF.
- **Seeder/migration scripts** for factors and reference data.
- **CHANGELOG.md** with Conventional Commits; CODEOWNERS; SECURITY.md; ADRs.

---

## 15) Initial Backlog (Epics → Stories)

- **E1: Platform Setup** – Monorepo (Nx/Turbo), lint/format, Prettier/ESLint, commit hooks.
- **E2: Auth & Users** – JWT + refresh, roles, status, audit, interceptors, guards.
- **E3: Factors** – Catalog CRUD, import, versioning, mapping to sectors, provenance.
- **E4: Inventory** – Year CRUD, sector forms, bulk upload, validations, state machine.
- **E5: Approvals** – Submit/review/approve, comments, notifications.
- **E6: Reporting** – By gas/sector, exports, saved views, deltas.
- **E7: Admin & Menu** – Dynamic menus by role; app settings.
- **E8: Observability & Security** – Health/readiness, logs, metrics, traces, CSP/WAF.
- **E9: CI/CD & IaC** – GitHub Actions, ECR/ECS, CloudFront, domain, certs.
- **E10: Data Migration** – Import BSON into proper collections/tables; reconciliation tools.

---

## 16) Change Log (for this PRD)

- **v0.2 (Aug 15, 2025):** Added concrete analysis from code; tailored PRD to observed Angular modules and API constants; added refactor plan and AWS target.
- **v0.1 (Aug 15, 2025):** Initial generic MRV PRD scaffold while awaiting code.
