# Contributing

This project follows a lightweight, high-discipline workflow suitable for a small team (PO + single dev).

## Branching & PRs

- **Trunk-based**: `main` is always releasable.
- Feature branches: `feat/<scope>`, `fix/<scope>`, `chore/<scope>`.
- Small PRs (≤ ~300 lines) with clear description and checklist.

## Commit Messages — Conventional Commits

Examples:
- `feat(api): add refresh token rotation with Secure cookie`
- `fix(web): align zone.js to ~0.15.x for Angular 20`
- `chore(dev): add Traefik HTTPS profile`

**Types**: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `build`, `ci`.

## Code Style

- **Frontend**: Angular standalone components, strict typing, RxJS 7.
- **API**: NestJS providers, DTO validation (`class-validator`), guards for auth/RBAC.
- **Lint**: ESLint (both), Prettier formatting (tabs/spaces as per repo config).
- **Testing**: Unit + e2e minimum for critical flows (auth, RBAC, ingestion).

## PR Checklist

- [ ] Tests added/updated (unit and/or e2e where applicable)
- [ ] Lint passes (`npm run lint`) and build is green
- [ ] Docs updated if behavior/config changed
- [ ] Security reviewed (CORS, cookies, headers, secrets)

## Versioning & Releases

- CI tags images per commit SHA.
- Releases are cut from `main` with semantic version tags (e.g., `v0.1.0`).

## Security

- Do not commit secrets.
- Cookies: `httpOnly`, `SameSite=Lax`; `Secure` in HTTPS.
- Restrict CORS to allowed origins.

## Architecture Notes

- **Auth**: Short-lived access token (Bearer) + long-lived refresh cookie (`/auth/refresh`).
- **Dev HTTPS**: Traefik or Caddy terminates TLS.
- **DB**: MongoDB 8 via Mongoose 8; plan Atlas for production.
