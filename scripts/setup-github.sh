#!/usr/bin/env bash
set -euo pipefail
echo "Creating labels..."
gh label create bug -c d73a4a --force || true
gh label create feature -c a2eeef --force || true
gh label create epic -c 5319e7 --force || true
gh label create chore -c cccccc --force || true
gh label create documentation -c 0075ca --force || true
gh label create test -c 0e8a16 --force || true
gh label create design -c fbca04 --force || true
echo "Creating milestones..."
gh api repos/:owner/:repo/milestones -f title='M0 — Repo & CI' >/dev/null
gh api repos/:owner/:repo/milestones -f title='M1 — Angular 20 Baseline' >/dev/null
gh api repos/:owner/:repo/milestones -f title='M2 — Material 3 UX' >/dev/null
gh api repos/:owner/:repo/milestones -f title='M3 — Tests & Coverage' >/dev/null
gh api repos/:owner/:repo/milestones -f title='M4 — Performance & A11y' >/dev/null
gh api repos/:owner/:repo/milestones -f title='M5 — AWS Deploy' >/dev/null
gh api repos/:owner/:repo/milestones -f title='M6 — Handover & Docs' >/dev/null
echo "Done."
