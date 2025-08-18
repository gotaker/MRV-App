# MRV — Angular 20 + Material 3 (GitHub-ready)

Production-ready starter: Angular 20, Material 3 (MDC), Jest, Cypress, ESLint (flat), Prettier, Husky,
Docker (prod), Docker (dev), and GitHub Actions (CI + AWS S3/CloudFront deploy).

## Quick Start
```bash
nvm use 20 || volta install node@20
npm ci
npm start  # http://localhost:4200
```

## Local Docker Dev
See `docs/DEV-DOCKER.md` for full details.
```bash
docker compose up --build
# app -> http://localhost:4200
# api -> http://localhost:3000/kpis
```

## Build, Test, Deploy
```bash
npm run lint
npm run test
npm run build:prod
# CI deploy requires repo secrets (AWS_* + S3_BUCKET + CLOUDFRONT_DISTRIBUTION_ID)
```
