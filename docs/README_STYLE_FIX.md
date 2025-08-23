# Style Fix Patch

This patch fixes:

- Sass `@import` deprecation by switching to `@use` in `src/styles.scss`.
- Angular Material 3 theme config error (no `secondary` key in `define-theme` color block).
- Ensures only `src/styles.scss` is referenced in `angular.json` styles.

## Apply

```powershell
Expand-Archive .\mrv-style-fix-2025-08-23.zip -DestinationPath . -Force
node scripts\fix-styles-config.cjs
npm run lint
npm start
```

You should no longer see the `@import` deprecation and `$config.color` property errors.
