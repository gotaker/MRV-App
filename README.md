# MRV App (Angular 20 + Material 3)
This repo is a refreshed, working baseline incorporating all fixes we discussed: Angular 20, Material 3 theming, typed state w/ Signals, Jest + Cypress, Docker dev + mock API, ESLint flat config, Husky + lint-staged, and Node 22.12.0 pinning.

## Quick start
```bash
# Use Node 22.12.0
nvm use 22.12.0  # or volta pin 22.12.0

npm ci
npm start
# App: http://localhost:4200
# Mock API: http://localhost:3000/kpis
```

## Docker
```bash
docker compose up --build
# web => http://localhost:4200
# mock-api => http://localhost:3000/kpis
# e2e (optional): docker compose run --rm e2e
```

## Tests
```bash
npm run lint
npm test
npm run e2e:run
```
