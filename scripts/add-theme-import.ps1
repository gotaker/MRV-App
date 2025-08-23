\
$styles = "src/styles.scss"
if (Test-Path $styles) {
  $content = Get-Content $styles -Raw
  if ($content -notmatch "@import 'src/styles/theme.scss';") {
    Add-Content $styles "@import 'src/styles/theme.scss';"
    Write-Output "Added theme import to src/styles.scss"
  } else {
    Write-Output "Theme import already present."
  }
} else {
  Write-Output "src/styles.scss not found, skipping."
}
