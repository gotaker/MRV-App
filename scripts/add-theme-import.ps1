Param(
  [string]$ThemePath = "src/styles/theme.scss",
  [string]$Global = "src/styles.scss"
)

# Ensure a global styles file exists; if only styles.css exists, rename to SCSS.
if (!(Test-Path $Global)) {
  if (Test-Path "src/styles.css") {
    Rename-Item "src/styles.css" "src/styles.scss" -Force
    $Global = "src/styles.scss"
    # Update angular.json to point to styles.scss
    node scripts\migrate-styles-to-scss.cjs
  } else {
    New-Item -ItemType File -Path $Global -Force | Out-Null
  }
}

# Ensure the theme import exists
if (Test-Path $ThemePath) {
  $content = Get-Content $Global -Raw
  if ($content -notmatch "@import 'src/styles/theme.scss';") {
    Add-Content $Global "@import 'src/styles/theme.scss';"
    Write-Output "Added theme import to $Global"
  } else {
    Write-Output "Theme import already present in $Global"
  }
} else {
  Write-Output "Theme file $ThemePath not found. Make sure it exists."
}
