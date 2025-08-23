\
#!/usr/bin/env bash
set -euo pipefail
STYLES="src/styles.scss"
if [ -f "$STYLES" ]; then
  if ! grep -q "@import 'src/styles/theme.scss';" "$STYLES"; then
    echo "@import 'src/styles/theme.scss';" >> "$STYLES"
    echo "Added theme import to src/styles.scss"
  else
    echo "Theme import already present."
  fi
else
  echo "src/styles.scss not found, skipping."
fi
