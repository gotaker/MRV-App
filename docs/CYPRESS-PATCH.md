# Cypress Configuration Patch

This adds a minimal Cypress 13+ setup compatible with the Docker e2e runner.

## Files

- `cypress.config.ts` — root config; reads `CYPRESS_baseUrl` env (e.g., http://web:4200 in Docker).
- `cypress/support/e2e.ts` — global hooks.
- `cypress/e2e/smoke.cy.ts` — example smoke test.
- `cypress/tsconfig.json` — TS setup for test files.

## Ensure devDependency

If not already present, add Cypress to devDependencies:

```bash
npm i -D cypress@^13.13.1
```

## Run in Docker

```bash
docker compose -f docker-compose.yml -f docker-compose.e2e.yml up --build e2e
```
