
Param(
  [string]$ReadmePath = "README.md",
  [string]$Branch = "docs/readme-badges-arch",
  [switch]$AutoCommit = $true
)

$ErrorActionPreference = "Stop"

function Get-RepoSlug {
  try {
    $url = (git remote get-url origin).Trim()
  } catch {
    return $null
  }
  if ($url -match "github\.com[:/](.+?)/(.+?)(\.git)?$") {
    return "$($Matches[1])/$($Matches[2].Replace('.git',''))"
  }
  return $null
}

function Ensure-Readme {
  param($Path)
  if (-not (Test-Path $Path)) {
    New-Item -ItemType File -Path $Path | Out-Null
  }
}

function Inject-Section {
  param($Path, $Content)
  $existing = Get-Content -Raw -ErrorAction SilentlyContinue -Path $Path
  if ($null -eq $existing) { $existing = "" }
  if ($existing -match "<!-- MRV README BADGES \(auto-injected\) -->") {
    Write-Host "Badges block already present. Skipping injection."
    return $false
  }
  # Place badges at the very top; keep existing content after a blank line
  $new = $Content + "`r`n" + $existing
  Set-Content -Encoding utf8 -NoNewline -Path $Path -Value $new
  return $true
}

# Resolve owner/repo
$slug = Get-RepoSlug
$owner="OWNER"; $repo="REPO"
if ($slug -and $slug.Contains("/")) {
  $owner = $slug.Split("/")[0]
  $repo  = $slug.Split("/")[1]
}

# Load snippet and substitute placeholders
$snippet = Get-Content -Raw -Path "README.additions.md"
$snippet = $snippet.Replace("${OWNER}", $owner).Replace("${REPO}", $repo)

# Create branch
try { git rev-parse --verify $Branch | Out-Null; $exists=$true } catch { $exists=$false }
if (-not $exists) { git checkout -b $Branch }
else { git checkout $Branch }

Ensure-Readme -Path $ReadmePath
$changed = Inject-Section -Path $ReadmePath -Content $snippet

if ($AutoCommit -and $changed) {
  git add $ReadmePath
  git commit -m "docs(readme): add CI/GHCR badges and Architecture & Analysis links"
  Write-Host "Committed changes on $Branch"
} elseif ($AutoCommit) {
  Write-Host "No changes to commit."
}

Write-Host "Done. Review README and push: git push -u origin $Branch"
