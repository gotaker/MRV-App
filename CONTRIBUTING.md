# Contributing

Thanks for helping improve MRV!

## Prerequisites
- Node 20 (`nvm use 20`) and npm v10+
- Angular CLI globally optional
- GitHub CLI `gh` (for scripts)

## Dev Workflow
```bash
npm ci
npm start            # dev server
npm run lint         # ESLint (flat)
npm run test         # Jest
npm run e2e          # Cypress (optional)
```

## Branch & Commit
- Branch: `feat/<scope>`, `fix/<scope>`, `chore/<scope>`
- **Conventional Commits**:
  - `feat(material): add M3 dark mode toggle`
  - `fix(api): handle 401 on token refresh`
  - `chore(ci): add deploy job`

## Pull Requests
- Fill PR template, link Issues
- Unit tests updated; e2e where relevant
- Lint passes (`npm run lint`)

## Code Style
- ESLint flat config + Prettier
- Angular standalone APIs; prefer signals; lazy routes

## Security
- See `SECURITY.md`. Do not include secrets in code or logs.
