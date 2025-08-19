# Jest Fix Bundle v2 (ts-jest enforced)

This bundle enforces TypeScript transform via **ts-jest** (so Jest parses `: Type` syntax)
and includes a minimal `tsconfig.spec.json`, `test-setup.ts`, and the updated KPI service spec.

## Files
- `jest.config.cjs` (uses ts-jest for `.ts`/`.html`, babel-jest for `.js/.mjs`)
- `tsconfig.spec.json`
- `src/test-setup.ts`
- `src/app/kpis/kpis.service.spec.ts`

## Apply
Copy files into your repo (preserving paths) then install dev deps:

```bash
npm i -D jest@29.7.0 jest-environment-jsdom@29.7.0 jest-preset-angular@14.6.1 ts-jest@29.2.5 babel-jest@29.7.0
```

Run tests:
```bash
npm run test -- --passWithNoTests --coverage
```

If Jest still loads `jest.config.ts`, remove/rename it so only `jest.config.cjs` remains or run:
```bash
npm run test -- --config=jest.config.cjs
```

## Commit message
```
test(jest): enforce ts-jest transform; add tsconfig.spec and test-setup; fix KPI spec
```
