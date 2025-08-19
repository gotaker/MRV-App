#!/usr/bin/env bash
set -euo pipefail
README_PATH="${1:-README.md}"
BRANCH="${2:-docs/readme-badges-arch}"
AUTO_COMMIT=1

get_repo_slug() {
  if ! url=$(git remote get-url origin 2>/dev/null); then
    echo ""
    return
  fi
  if [[ "$url" =~ github\.com[:/](.+?)/(.+?)(\.git)?$ ]]; then
    echo "${BASH_REMATCH[1]}/${BASH_REMATCH[2]%.git}"
  else
    echo ""
  fi
}

ensure_readme() {
  [[ -f "$README_PATH" ]] || touch "$README_PATH"
}

inject_section() {
  local content="$1"
  if grep -q "<!-- MRV README BADGES (auto-injected) -->" "$README_PATH"; then
    echo "Badges block already present. Skipping injection."
    return 1
  fi
  tmp="$(mktemp)"
  { echo -n "$content"; echo; echo; cat "$README_PATH"; } > "$tmp"
  mv "$tmp" "$README_PATH"
  return 0
}

slug="$(get_repo_slug)"
owner="OWNER"; repo="REPO"
if [[ -n "$slug" ]]; then
  owner="${slug%%/*}"
  repo="${slug##*/}"
fi

snippet="$(cat README.additions.md)"
snippet="${snippet//'${OWNER}'/$owner}"
snippet="${snippet//'${REPO}'/$repo}"

if git rev-parse --verify "$BRANCH" >/dev/null 2>&1; then
  git checkout "$BRANCH"
else
  git checkout -b "$BRANCH"
fi

ensure_readme
if inject_section "$snippet"; then
  if [[ $AUTO_COMMIT -eq 1 ]]; then
    git add "$README_PATH"
    git commit -m "docs(readme): add CI/GHCR badges and Architecture & Analysis links"
  fi
fi

echo "Done. Review README and push: git push -u origin $BRANCH"
