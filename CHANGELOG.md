# Changelog

All notable changes to this project will be documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and Semantic Versioning.

## [Unreleased]

- TBD

## [0.3.0] - 2025-08-18

### Added

- **Cypress 13** configuration (`cypress.config.ts`, support, smoke test).
- **Dockerized e2e** runner (`Dockerfile.e2e`) on **Node 22** with **wait-on** in `docker-compose.e2e.yml`.
- **Image versioning**: `.env.example`, `scripts/update-env.mjs`, `docker-compose.version.yml`, OCI labels in Dockerfiles.
- **GHCR publish** workflow (`.github/workflows/docker-publish.yml`).
- **Dev HTTPS** support (certs mount; `ng serve --ssl`), plus `scripts/nginx-ssl.conf` for containerized TLS.
- **API_BASE_URL** runtime token; dashboard fetches KPIs from mock API with typed signal state.

### Changed

- **Angular 20.1.x** + **Material 3** baseline (default M3 palettes, brand/typography).
- **ESLint 9 (flat)** using `angular-eslint` + `typescript-eslint`; inline template linting enabled.
- **Husky v10** migration (no `husky.sh` sourcing).
- **Jest pinned to 29.x** (CLI 20 compatibility).

### Fixed

- Compose v2 cleanup (removed `version:` key).
- Replaced private GHCR mock-api with public `clue/json-server` image.
- Corrected Angular template lint rule names; extended Angular recommended presets.
- Removed `any` casts in dashboard; discriminated union state.

## [0.2.0] - 2025-08-15

### Added

- Docker dev environment (`Dockerfile.dev`, `docker-compose.yml`).
- Mock API (`mock/db.json`) via json-server image.

### Changed

- Repository scaffolding: CODEOWNERS, CONTRIBUTING.md, SECURITY.md, issue/PR templates.

## [0.1.0] - 2025-08-10

### Added

- Initial MRV app import and baseline documentation.

[Unreleased]: https://github.com/your-org/MRV-App/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/your-org/MRV-App/releases/tag/v0.3.0
[0.2.0]: https://github.com/your-org/MRV-App/releases/tag/v0.2.0
[0.1.0]: https://github.com/your-org/MRV-App/releases/tag/v0.1.0
