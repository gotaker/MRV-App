# Jest Babel Fix Bundle

This bundle adds a **Babel config** so `jest-preset-angular` can parse TypeScript syntax,
and updates `jest.config.cjs` to ignore the extracted `/files/` directory (to avoid duplicate test runs).

## Apply (from repo root)
```powershell
Expand-Archive jest-babel-fix-bundle.zip -DestinationPath . -Force
Copy-Item .\jest-babel-fix-bundle\files\* . -Recurse -Force

# Ensure older configs don't shadow the new one
if (Test-Path jest.config.ts) { Rename-Item jest.config.ts jest.config.ts.bak }
if (Test-Path jest.config.js) { Rename-Item jest.config.js jest.config.js.bak }

# Install Babel presets used by jest-preset-angular's transformer
npm i -D @babel/preset-env@^7.25.0 @babel/preset-typescript@^7.25.0

# (If not already installed)
npm i -D jest@29.7.0 jest-environment-jsdom@29.7.0 jest-preset-angular@14.6.1
```

Run:
```powershell
npm run test -- --config=jest.config.cjs --passWithNoTests --coverage
```
