# E2E Overlay — Wait for Web

This overlay updates the `e2e` service to wait for `http://web:4200` to be reachable before running Cypress.

## Use
```bash
docker compose -f docker-compose.yml -f docker-compose.e2e.yml up --build e2e
```

For HTTPS dev server, edit the overlay:
```yaml
environment:
  - CYPRESS_baseUrl=https://web:4200
  - NODE_TLS_REJECT_UNAUTHORIZED=0
entrypoint: [ "bash", "-lc", "npm ci || npm install; npx --yes wait-on https-get://web:4200 --timeout 300000 && npx cypress run" ]
```
