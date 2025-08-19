# Commit & PR Plan

We enforce **Conventional Commits** and **PR-only** workflow for all changes (including fixes).

## Branching

- `main`: protected; merge via PR only, squash or rebase.
- Feature: `feat/<scope>`
- Fix: `fix/<scope>`
- Chore/Docs/Test: `chore/<scope>`, `docs/<scope>`, `test/<scope>`

## Conventional Commit Types (examples)

- `feat(material): finalize M3 baseline with density and typography`
- `fix(docker): switch mock-api to public image and map 3000:80`
- `chore(test): pin Jest to 29.x for CLI 20 compatibility`
- `refactor(dashboard): use typed discriminated union for state`
- `docs(readme): add Docker SSL and image versioning instructions`

## PR Checklist

- Lint passes: `npm run lint`
- Unit tests pass: `npm test`
- E2E passes (when applicable): `docker compose -f docker-compose.yml -f docker-compose.e2e.yml up --build e2e`
- Updated docs where relevant (README/UPGRADE/CHANGELOG)
- Conventional Commit title; descriptive PR body with verification steps

## Tags & Releases

- Use `npm version <patch|minor|major>` to bump SemVer.
- Lifecycle `"version": "node scripts/update-env.mjs && git add .env VERSION"` updates `.env` + `VERSION`.
- Push with tags: `git push && git push --tags`.
- GHCR publish workflow builds images tagged with the new version and `sha-<short>`.

## Commit Message Templates

**Feature**

```
feat(<scope>): <short summary>

- <details/bullets>
- tests/docs updated
```

**Fix**

```
fix(<scope>): <short summary>

- root cause:
- fix:
- verification:
```

**Chore/Docs**

```
chore(<scope>): <short summary>
```

## Current Milestones (examples)

- `0.3.0`: Angular 20 + M3 baseline complete; e2e Docker; image versioning; GHCR publish.
- `0.4.0`: Production deployment (S3+CloudFront) live with OIDC role; Lighthouse/axe checks in CI.
