# Jest Fix Bundle v3 (modern setup + strict Jest types)

This bundle:
- Uses `setupZoneTestEnv` via `setup-jest.cjs` (no deprecated setup-jest.js).
- Drops `globalSetup` (ngcc) which is not needed for Angular 16+.
- Restricts test TS types to **Jest** to avoid Chai/Jasmine conflicts.
- Explicitly imports `expect` from `@jest/globals` in the KPI spec to disambiguate.

## Apply (from repo root)
```powershell
Expand-Archive jest-fix-bundle-v3.zip -DestinationPath . -Force
Copy-Item .\jest-fix-bundle-v3\files\* . -Recurse -Force

# Ensure no other Jest configs shadow this one
if (Test-Path jest.config.ts) { Rename-Item jest.config.ts jest.config.ts.bak }
if (Test-Path jest.config.js) { Rename-Item jest.config.js jest.config.js.bak }

# Pin compatible toolchain
npm i -D jest@29.7.0 jest-environment-jsdom@29.7.0 jest-preset-angular@14.6.1 @babel/preset-env@^7.25.0 @babel/preset-typescript@^7.25.0

# Remove conflicting types (if present)
npm remove @types/chai chai @types/jasmine jasmine-core
```

Run:
```powershell
npx jest --clearCache
npm run test -- --config=jest.config.cjs --passWithNoTests --coverage
```

## Commit message
```
test(jest): modern setup-zone env; restrict types to Jest; disambiguate expect; update KPI spec
```
