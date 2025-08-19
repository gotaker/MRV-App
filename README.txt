# E2E Timeout Fix

Cypress started before the dev server was reachable. This patch changes the e2e overlay to wait on the **TCP port** instead of an HTTP/HTTPS probe, so it works regardless of SSL.

## Usage

HTTP dev server (default):
```bash
docker compose -f docker-compose.yml -f docker-compose.e2e.yml up --build e2e
```

HTTPS dev server:
```yaml
# in docker-compose.e2e.yml (uncomment)
environment:
  - CYPRESS_baseUrl=https://web:4200
  - NODE_TLS_REJECT_UNAUTHORIZED=0
```
Command already waits on `tcp:web:4200`, so no change needed there.

## Optional: Healthcheck overlay

You can also add a healthcheck to `web` and wait on it:
```bash
docker compose -f docker-compose.yml -f docker-compose.health.yml -f docker-compose.e2e.yml up --build e2e
```
Set `HEALTH_URL` to `https://localhost:4200` if using SSL (ng serve), or leave default `http://localhost:4200`.
