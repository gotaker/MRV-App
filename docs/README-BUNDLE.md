MRV — Angular 20 + Material 3 (GitHub-ready)

Production starter for the MRV app using Angular 20, Angular Material (M3), ESLint 9 flat (via angular-eslint + typescript-eslint), Prettier, Husky v10, Jest (unit), Cypress (e2e), Docker (prod & dev), and GitHub Actions for AWS S3 + CloudFront deploys.

Policy: for issues and bug fixes always create a PR. Use Conventional Commits.

Stack

Angular 20 (standalone APIs, signals-friendly)

Material 3 theming (src/styles/theme.scss) with light/dark toggle

Lint: ESLint 9 flat (angular-eslint, typescript-eslint, @eslint/js)

Format: Prettier

Tests: Jest (unit), Cypress (e2e)

CI/CD: GitHub Actions → S3 & CloudFront (OIDC)

Containers: Nginx (prod), Node 22 + ng serve (dev)

Community: CODEOWNERS, CONTRIBUTING.md, SECURITY.md, templates

Requirements

Node 20 (use nvm use 20 or Volta)

npm 10+

Angular 20 peer: zone.js ~0.15 (repo pins ^0.15.1)

Optional: Docker 24+, GitHub CLI gh for setup scripts

Quick Start (local)
nvm use 20 || volta install node@20
npm ci
npm start   # http://localhost:4200


Build & test:

npm run lint
npm run test
npm run build:prod

Quick Start (Docker dev)
docker compose up --build
# app -> http://localhost:4200
# api -> http://localhost:3000/kpis


Notes

The dev container runs ng serve with polling so edits hot-reload.

mock-api uses a public image and serves on container port 80.

Minimal docker-compose.yml services:

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports: ["4200:4200"]
    environment:
      - CHOKIDAR_USEPOLLING=true
      - NG_CLI_ANALYTICS=false
    volumes:
      - ./:/app
      - /app/node_modules
    command: ["npx","ng","serve","--host","0.0.0.0","--port","4200","--poll","2000"]

  mock-api:
    image: clue/json-server:latest
    volumes:
      - ./mock/db.json:/data/db.json:ro
    ports: ["3000:80"]  # -> http://localhost:3000


Compose v2 does not need the top-level version: key.

Scripts
"scripts": {
  "start": "ng serve",
  "build": "ng build",
  "build:prod": "ng build --configuration production",
  "lint": "eslint .",
  "format": "prettier -w .",
  "test": "jest",
  "e2e": "cypress run",
  "e2e:open": "cypress open",
  "prepare": "husky" // v10
}


Run inside Docker:

docker compose exec web npm run lint
docker compose exec web npm test
docker compose run --rm e2e

Linting (flat config)

ESLint config at eslint.config.js (flat).

Uses angular-eslint flat presets + typescript-eslint helper and processes inline templates.

If you update lint deps, re-install:

npm i -D angular-eslint @eslint/js typescript-eslint
npm run lint

Husky v10

Pre-commit hook at .husky/pre-commit:

#!/usr/bin/env sh
# Husky v10: no husky.sh sourcing
npm run lint --silent || true
npx lint-staged


Initialize (once per clone):

npm run prepare

CI/CD (GitHub Actions → AWS)

Set repo secrets:

AWS_DEPLOY_ROLE_ARN

AWS_REGION

S3_BUCKET

CLOUDFRONT_DISTRIBUTION_ID

Workflows:

.github/workflows/ci.yml — lint, test, build on PRs/pushes

.github/workflows/deploy-s3.yml — builds & syncs to S3, invalidates CloudFront (on main)

Project Management

Import issues: docs/github-issues-import.csv (GitHub → Issues → “⋯ → Import”).
Create labels & milestones:

./scripts/setup-github.sh


Create a Projects v2 board:

# For user-owned:
./scripts/setup-projects.sh --title "MRV Upgrade"

# For org and auto-import open issues:
./scripts/setup-projects.sh --org YOUR_ORG --title "MRV Upgrade" --import-issues

Contributing & PR Policy

Always open a PR for issues and bug fixes.

Branches: feat/<scope>, fix/<scope>, chore/<scope>, etc.

Conventional Commits required:

feat(material): add density tokens

fix(api): handle 401 refresh

chore(ci): add deploy job

Update tests/docs where relevant.

Troubleshooting

ERESOLVE for zone.js
Angular 20.1.x peers zone.js ~0.15. Ensure:

npm pkg set dependencies.zone.js='^0.15.1'
npm install


Compose warning about version: remove the version: key.

Denied image for mock API: use clue/json-server:latest (public).
mock-api service should map 3000:80 and mount ./mock/db.json:/data/db.json:ro.

Cypress on Apple Silicon: set platform: linux/amd64 for the e2e service if needed.

Material 3 Theme

Edit src/styles/theme.scss. Light/Dark toggle:

document.documentElement.classList.toggle('dark-theme', trueOrFalse);

AWS Deploy (manual)
npm run build:prod
# upload dist/mrv/** to S3, then invalidate CloudFront

Files of interest

src/app/shell/shell.component.ts – app shell with dark toggle

src/app/dashboard/dashboard.component.ts – example card

src/styles/theme.scss – M3 theme tokens

Dockerfile + scripts/nginx.conf – production container

Dockerfile.dev + docker-compose.yml – local dev container

.github/ – workflows, templates, CODEOWNERS, dependabot

CONTRIBUTING.md, SECURITY.md, docs/PROJECT_PLAN.md

License / Security

See SECURITY.md to report vulnerabilities privately.

License: (add your license here).

Changelog

See CHANGELOG.md.
