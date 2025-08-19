# E2E in Docker (Node 22)

Run Cypress e2e with a Node 22 runner so Angular 20 engine requirements are satisfied.

## Usage

```bash
# Build and run web + e2e (overlay overrides the e2e service)
docker compose -f docker-compose.yml -f docker-compose.e2e.yml up --build e2e

# Just run tests (web must be up)
docker compose -f docker-compose.yml -f docker-compose.e2e.yml run --rm e2e
```

If your dev server runs with `--ssl`, use:

```yaml
environment:
  - CYPRESS_baseUrl=https://web:4200
  - NODE_TLS_REJECT_UNAUTHORIZED=0
```
