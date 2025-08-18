# Local Dev on Docker — Angular 20 + Material 3
## Quick start

```
bash
# from your Angular repo root (package.json present)
unzip mrv-dev-docker-pack.zip -d .
# start dev server + mock API\ndocker compose up --build
# app: http://localhost:4200
# api: http://localhost:3000/kpis
```
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
