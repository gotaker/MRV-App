# Local Dev on Docker — Angular 20 + Material 3
\n
\n

## Quick start
\n```
bash
\n
# from your Angular repo root (package.json present)
\n
unzip mrv-dev-docker-pack.zip -d .
\n
# start dev server + mock API\ndocker compose up --build
\n
# app: http://localhost:4200
\n
# api: http://localhost:3000/kpis
\n```
\n
\n
### Cypress e2e
\n
```bash
\n
docker compose run --rm e2e
\n
```
\n
\n
### Jest, Lint, Format
\n
```bash
\n
docker compose exec web npm test
\n
docker compose exec web npm run lint
\n
docker compose exec web npm run format
\n
```
\n
