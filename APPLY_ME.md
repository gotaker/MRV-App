# Apply this patch bundle (Next Steps)

Run these commands from your repo root.

## 1) Copy files

PowerShell (Windows):

```powershell
Expand-Archive .\mrv-next-steps-2025-08-23.zip -DestinationPath . -Force
Copy-Item .\mrv-next-steps-2025-08-23\* . -Recurse -Force
```

Bash (macOS/Linux):

```bash
unzip -o mrv-next-steps-2025-08-23.zip
cp -r mrv-next-steps-2025-08-23/* .
```

## 2) Update package.json (engines, lint-staged)

```bash
node scripts/apply-tooling.js
```

## 3) Ensure Husky hook is executable (macOS/Linux)

```bash
chmod +x .husky/pre-commit
```

## 4) Optional: add M3 theme import to styles.scss

PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/add-theme-import.ps1
```

Bash:

```bash
bash scripts/add-theme-import.sh
```

## 5) Install and test

```bash
npm install
npm run lint
npm test
```

## 6) Commit via PR

Create a branch and open a PR with message:

- chore(tooling): pin Node to 22.12.0 and update husky pre-commit hook
- feat(theme): adopt Material 3 tokens and remove deprecated palettes
- ci: add GitHub Actions for lint/test/build
- test(e2e): stabilize compose healthchecks and add dashboard smoke spec (optional)
