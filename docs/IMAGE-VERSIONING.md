# Image & Container Versioning

We version local and CI images using SemVer from `package.json` and embed metadata using OCI labels.

## Files

- `.env.example` → copy to `.env`. Holds `APP_VERSION`, `REGISTRY`, etc.
- `scripts/update-env.mjs` → runs on `npm version` to sync `.env`, `VERSION`, and git data.
- `docker-compose.version.yml` → overlay that sets image name/tags and build args.
- `Dockerfile.dev`, `Dockerfile.e2e` → accept build args and set OCI labels.
- `.github/workflows/docker-publish.yml` → builds and pushes to GHCR on `main`.

## Local usage

```bash
# sync .env from package.json (also runs on `npm version patch|minor|major`)
node scripts/update-env.mjs

# versioned dev build
docker compose -f docker-compose.yml -f docker-compose.version.yml build web
docker compose -f docker-compose.yml -f docker-compose.version.yml up web

# versioned e2e
docker compose -f docker-compose.yml -f docker-compose.version.yml -f docker-compose.e2e.yml run --rm e2e
```

## CI (GHCR)

On push to `main`, the workflow builds and pushes:

- `ghcr.io/<owner>/mrv-web:<pkg.version>` and `:sha-<short>` (plus `latest`)
- `ghcr.io/<owner>/mrv-e2e:<pkg.version>` and `:sha-<short>`

Images include OCI labels:

- `org.opencontainers.image.version`, `revision`, `created`, `source`

## Bumping the version

```bash
npm version patch  # or minor/major
node scripts/update-env.mjs   # (runs automatically if you add `"version": "node scripts/update-env.mjs"`)
git push && git push --tags
```
