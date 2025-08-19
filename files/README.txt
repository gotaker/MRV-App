# Jest Fix Bundle v4 (no global-setup, explicit zone setup, alias expect)

## Files
- jest.config.cjs (no globalSetup, no deprecated setup-jest.js)
- setup-jest.cjs (calls setupZoneTestEnv)
- tsconfig.spec.json (limits types to Jest + Node)
- src/test-setup.ts (minimal)
- src/app/kpis/kpis.service.spec.ts (uses alias 'jestExpect')

## Apply (PowerShell)
Expand-Archive jest-fix-bundle-v4.zip -DestinationPath . -Force
Copy-Item .\jest-fix-bundle-v4\files\* . -Recurse -Force

# Ensure only CJS config is active
if (Test-Path jest.config.ts) { Rename-Item jest.config.ts jest.config.ts.bak -Force }
if (Test-Path jest.config.js) { Rename-Item jest.config.js jest.config.js.bak -Force }
npm pkg set scripts.test="jest --config=jest.config.cjs"

# Pin toolchain (adjust if already present)
npm i -D jest@29.7.0 jest-environment-jsdom@29.7.0 jest-preset-angular@14.6.1 @babel/preset-env@^7.25.0 @babel/preset-typescript@^7.25.0

# Remove conflicting test frameworks/types
npm remove @types/chai chai @types/jasmine jasmine-core 2>$null

# Clear cache & run
npx jest --clearCache
npm run test -- --passWithNoTests --coverage

## Commit
test(jest): drop global-setup; modern zone setup; restrict types; alias expect; fix KPI spec
