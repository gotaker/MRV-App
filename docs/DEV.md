# Developer Guide

This document covers day-to-day development, environment setup, and troubleshooting.

## Versions & Engines

- Angular **20.1.7**, CLI **20.1.6**
- TypeScript **5.8.3**, Zone.js **0.15.x**
- Node **20.19.0** via `.nvmrc` (engines enforced with `.npmrc`)
- MongoDB **8**, Mongoose **8**

## First Run (HTTP)

```bash
docker compose down -v
docker compose up -d web api mongo mongo-express
docker compose logs -f web
```

Open:
- App: http://localhost:4200
- API: http://localhost:3000/healthz
- Mongo Express: http://localhost:8081

**Why we use named volumes for `node_modules`**  
Bind-mounting the source can mask `node_modules` inside the container. We mount `/usr/src/app/node_modules` as a **named volume** to prevent this.

## Local HTTPS

### Option A: Traefik (recommended)
1. Install `mkcert` and create trusted certs:
   ```bash
   mkcert -install
   mkcert -cert-file ./certs/localhost.pem -key-file ./certs/localhost-key.pem "localhost" 127.0.0.1 ::1
   ```
2. Start:
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.https.yml --profile traefik up -d traefik web api
   ```
3. Browse **https://localhost** (app), **http://localhost:8080** (dashboard)

### Option B: Caddy
```bash
docker compose up -d caddy web api
# Browse https://localhost
```

## Environment

`.env` (dev defaults)
```
CORS_ORIGIN=https://localhost
COOKIE_SECURE=true
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=ChangeMe123
API_PORT=3000
MONGO_URI=mongodb://mongo:27017/mrv
```

## Frontend (Angular)

```bash
# Inside the web container (or host Node 20.19.0)
npm start                  # ng serve (HTTP)
npm run start:https        # optional direct HTTPS (port 4443) if certs mounted
npm run build
```

**Angular 20 workspace tips**
- `angular.json` dev-server uses **`buildTarget`** (not `browserTarget`)
- Import `CommonModule` from `@angular/common` (not from `@angular/common/http`)
- Function-based interceptors:
  ```ts
  provideHttpClient(withInterceptors([authInterceptor]))
  ```

## API (NestJS)

```bash
# Inside the api container
npm run start:dev
npm run build
```

**Key endpoints**
- `GET /healthz`, `GET /readyz`
- `POST /auth/login` → `{ accessToken }` + refresh cookie
- `POST /auth/refresh` → rotates refresh cookie + returns new access token
- `POST /auth/logout`
- `GET /auth/me`, `GET /auth/whoami` (Bearer token)

## Testing (initial setup to add)

- **Web**: unit (Jest), e2e (Playwright or Cypress)
- **API**: unit (Jest), e2e (supertest)
- **CI**: GitHub Actions — install, lint, test, build images

## Troubleshooting

- **Angular not reachable**
  - `docker compose ps web`, `docker compose logs -f web`
  - Change host port if 4200 is busy: `ports: ["4300:4200"]`
- **Peer dependency conflicts**
  - We **pin exact versions** in `apps/web/package.json`
- **File watching on Windows/WSL**
  - Dev server uses `--poll 2000` and `CHOKIDAR_USEPOLLING=true`
- **CORS/cookies over HTTPS**
  - Ensure `.env`: `CORS_ORIGIN=https://localhost`, `COOKIE_SECURE=true`

## Seed Admin

Auto-created at API bootstrap:
- Email: `admin@example.com`
- Password: `ChangeMe123`

Change via `.env` and restart API.

## Useful curl tests

```bash
# Login
curl -k -X POST "https://localhost/api/auth/login"   -H "Content-Type: application/json"   -d '{"email":"admin@example.com","password":"ChangeMe123"}' -i

# Who am I (Bearer)
curl -k "https://localhost/api/auth/whoami" -H "Authorization: Bearer <token>"
```
