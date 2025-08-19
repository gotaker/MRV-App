# Consolidated README Patch

This bundle adds **badges** (CI, GHCR, Angular, Node, License) and the **Architecture & Analysis** links to your `README.md`.

## Use (PowerShell)
```powershell
# from repo root
Expand-Archive mrv-readme-badges-arch-patch.zip -DestinationPath . -Force
pwsh ./scripts/apply-readme-consolidated.ps1
git push -u origin docs/readme-badges-arch
```

## Use (Bash)
```bash
unzip -o mrv-readme-badges-arch-patch.zip
bash ./scripts/apply-readme-consolidated.sh
git push -u origin docs/readme-badges-arch
```

The scripts will:
- Detect your `owner/repo` from `git remote origin` and substitute badge URLs.
- Create a branch `docs/readme-badges-arch`.
- Inject the block at the **top** of `README.md` (idempotent).
- Commit with message: `docs(readme): add CI/GHCR badges and Architecture & Analysis links`.

If you prefer raw patch:
```bash
git apply --index patches/consolidated-readme-badges-arch.patch
git commit -m "docs(readme): add CI/GHCR badges and Architecture & Analysis links"
```
