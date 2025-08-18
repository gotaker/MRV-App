#!/usr/bin/env bash
set -euo pipefail
# Create a GitHub Projects (v2) board and optionally import open issues.
# Usage: ./scripts/setup-projects.sh [--org ORG] [--title "MRV Upgrade"] [--import-issues]

ORG_NAME=""; TITLE="MRV Upgrade"; IMPORT_ISSUES=false
while [[ $# -gt 0 ]]; do
  case "$1" in
    --org) ORG_NAME="$2"; shift 2;;
    --title) TITLE="$2"; shift 2;;
    --import-issues) IMPORT_ISSUES=true; shift 1;;
    *) echo "Unknown arg: $1"; exit 1;;
  esac
done

if [[ -n "$ORG_NAME" ]]; then OWNER_ID=$(gh api "orgs/$ORG_NAME" --jq '.node_id'); else OWNER_ID=$(gh api "user" --jq '.node_id'); fi
CREATE_RES=$(gh api graphql -f query='
mutation($title:String!, $owner:ID!){
  createProjectV2(input:{title:$title, ownerId:$owner}){ projectV2 { id url title } }
}' -F title="$TITLE" -F owner="$OWNER_ID")
PROJECT_ID=$(echo "$CREATE_RES" | jq -r '.data.createProjectV2.projectV2.id')
PROJECT_URL=$(echo "$CREATE_RES" | jq -r '.data.createProjectV2.projectV2.url')
echo "✅ Created project: $PROJECT_URL"

gh api graphql -f query='mutation($p:ID!){ addProjectV2Field(input:{projectId:$p, name:"Priority", dataType:SINGLE_SELECT, singleSelectOptions:[{name:"P0"},{name:"P1"},{name:"P2"},{name:"P3"}]}){ projectV2Field { id }}}' -F p="$PROJECT_ID" >/dev/null
gh api graphql -f query='mutation($p:ID!){ addProjectV2Field(input:{projectId:$p, name:"Milestone", dataType:TEXT}){ projectV2Field { id }}}' -F p="$PROJECT_ID" >/dev/null

if $IMPORT_ISSUES; then
  REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
  mapfile -t ISSUE_IDS < <(gh issue list --repo "$REPO" --state open --limit 200 --json id -q '.[].id')
  for IID in "${ISSUE_IDS[@]}"; do
    gh api graphql -f query='mutation($p:ID!, $c:ID!){ addProjectV2ItemById(input:{projectId:$p, contentId:$c}){ item { id }}}' -F p="$PROJECT_ID" -F c="$IID" >/dev/null || true
  done
  echo "✅ Imported ${#ISSUE_IDS[@]} issues."
fi
echo "Done. URL: $PROJECT_URL"
