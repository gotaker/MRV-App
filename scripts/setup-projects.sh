#!/usr/bin/env bash
set -euo pipefail

# Creates a GitHub Projects (v2) board for the current authenticated USER or an ORG,
# and optionally adds all open issues from the current repo to that project.
#
# Requirements:
#   - GitHub CLI (gh) authenticated with repo + project permissions
#   - jq available
#
# Usage:
#   ./scripts/setup-projects.sh [--org ORG] [--title "MRV Upgrade"] [--import-issues]
#
ORG_NAME=""
TITLE="MRV Upgrade"
IMPORT_ISSUES=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --org) ORG_NAME="$2"; shift 2;;
    --title) TITLE="$2"; shift 2;;
    --import-issues) IMPORT_ISSUES=true; shift 1;;
    *) echo "Unknown arg: $1"; exit 1;;
  esac
done

echo "Creating GitHub Project (v2) titled: $TITLE"
if [[ -n "$ORG_NAME" ]]; then
  OWNER_ID=$(gh api "orgs/$ORG_NAME" --jq '.node_id')
else
  OWNER_ID=$(gh api "user" --jq '.node_id')
fi

# Create the project
CREATE_RES=$(gh api graphql -f query='
mutation($title:String!, $owner:ID!){
  createProjectV2(input:{title:$title, ownerId:$owner}){
    projectV2 { id number url title }
  }
}' -F title="$TITLE" -F owner="$OWNER_ID")

PROJECT_ID=$(echo "$CREATE_RES" | jq -r '.data.createProjectV2.projectV2.id')
PROJECT_URL=$(echo "$CREATE_RES" | jq -r '.data.createProjectV2.projectV2.url')
echo "✅ Created project: $PROJECT_URL"

# Add a Priority field (single-select)
gh api graphql -f query='
mutation($proj:ID!) {
  addProjectV2Field(input:{projectId:$proj, name:"Priority", dataType:SINGLE_SELECT,
    singleSelectOptions:[{name:"P0"},{name:"P1"},{name:"P2"},{name:"P3"}]}) {
    projectV2Field { id }
  }
}' -F proj="$PROJECT_ID" >/dev/null

# Add a Milestone field (text)
gh api graphql -f query='
mutation($proj:ID!) {
  addProjectV2Field(input:{projectId:$proj, name:"Milestone", dataType:TEXT}) {
    projectV2Field { id }
  }
}' -F proj="$PROJECT_ID" >/dev/null

echo "✅ Added fields: Priority (select), Milestone (text)"
echo "ℹ️ Configure views (Board/Table) in the UI as needed."

# Optionally import open issues from current repo
if $IMPORT_ISSUES; then
  REPO_JSON=$(gh repo view --json nameWithOwner)
  REPO=$(echo "$REPO_JSON" | jq -r '.nameWithOwner')
  echo "Importing open issues from $REPO into the project..."
  # Fetch issue node IDs
  mapfile -t ISSUE_IDS < <(gh issue list --repo "$REPO" --state open --limit 200 --json id --jq '.[].id')
  for IID in "${ISSUE_IDS[@]}"; do
    gh api graphql -f query='
    mutation($proj:ID!, $content:ID!){
      addProjectV2ItemById(input:{projectId:$proj, contentId:$content}) { item { id } }
    }' -F proj="$PROJECT_ID" -F content="$IID" >/dev/null || true
  done
  echo "✅ Imported ${#ISSUE_IDS[@]} issues."
fi

echo "Done. Project URL: $PROJECT_URL"
