# AI Coding Agent Instructions for MRV App

## Project Overview
**MRV App** is an Angular 20 application for displaying KPIs with a built-in mock JSON API. Focus areas: standalone components, signals-based state management, Material Design, and robust error handling.

## Architecture & Data Flow

### Component Hierarchy
- **AppComponent** (root) → Toolbar with navigation
- **HomeComponent** → Landing page with API status + KPI preview
- **DashboardComponent** → Card-grid view of all KPIs
- **KpisListComponent** → Table view with search, sort, pagination
- **KpiDetailComponent** → Individual KPI detail card
- **LoginComponent** → Auth form (mock implementation)

### State Management Pattern
Components use **signals** + **derived computed()** signals for reactive state:

```typescript
// See kpi-detail.component.ts & home.component.ts for examples
type State<T> = LoadingState | ErrorState | OkState<T>;
private state = toSignal<State<T>>(observable, { requireSync: true });
readonly loading = computed(() => this.state().kind === 'loading');
readonly data = computed(() => this.state().kind === 'ok' ? this.state().data : []);
```

Use **discriminated unions** to model UI states (loading/error/success) — avoids null-checking boilerplate.

### HTTP & Interceptors
- **authInterceptor** (src/app/shared/auth.interceptor.ts): Injects `Authorization: Bearer <token>` header
- **errorInterceptor** (src/app/shared/error.interceptor.ts): Catches HTTP errors, shows snackbar toast
- **GlobalErrorHandler** (src/app/shared/global-error.handler.ts): Catches uncaught errors, displays snackbar
- Request URL pattern: `/kpis`, `/kpis/:id`, `/kpiTrends?kpiId=:id` (proxied to mock API at `127.0.0.1:3001`)

### Authentication
- **AuthService** (src/app/auth/auth.service.ts): Mock login, stores token + user in localStorage
- **authGuard** (src/app/auth/auth.guard.ts): Protects /dashboard, /kpis routes
- Token: base64-encoded `username:timestamp`

## Dev Workflow

### Essential Commands
```bash
npm run start:all          # Start web (4200) + mock API (3001) concurrently
npm start                  # Web only, Angular dev server
npm run mock:api           # Mock API only
npm test                   # Jest unit tests (no coverage gates yet)
npm run lint               # ESLint (Angular + TypeScript)
npm run lint:fix           # Auto-fix lint issues
npm run doctor             # Validate config + detect misconfigurations
npm run format             # Prettier on staged files
npm run ci:verify          # CI pipeline (doctor + build + test + lint)
```

### Proxy Configuration
proxy.conf.json maps `/kpis`, `/kpiTrends` → `http://127.0.0.1:3001`. If working with API changes, update mock data in mocks/db.json, not the proxy config.

### Build & Prod
- `npm run build` → Production build to `dist/mrv-angular20`
- Docker available: `npm run docker:up` (see docker-compose.yml)

## Project Conventions

### Standalone Components
All components are **standalone** (no NgModule). Import only needed modules in the component's `imports:` array.

Example pattern:
```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `...`,
})
export class ExampleComponent {}
```

### Service Registration
Services use `providedIn: 'root'` (singleton via tree-shaking):
```typescript
@Injectable({ providedIn: 'root' })
export class MyService { ... }
```

### Testing Patterns
- **Test setup**: src/test-setup.ts initializes Jest + zone.js
- Use `TestBed.configureTestingModule()` with mock providers
- Test with signals via `fixture.detectChanges()` and tick async operations
- Examples: src/app/home/home.component.spec.ts, src/app/kpis/kpi-detail.component.spec.ts

### Styling
- Global styles: src/styles.scss
- Material theme: src/styles/theme.scss (v20 API, light theme, blue primary)
- Inline component styles use scoped CSS (`:host` selector for layout)
- No shared component stylesheet directory — prefer inline or global

### Error Handling
Always use try-catch in `GlobalErrorHandler` when calling snackbar (it may fail). Errors route through:
1. HTTP errors → errorInterceptor (snackbar) → component (through Observable)
2. Thrown errors → GlobalErrorHandler (snackbar) → console
3. Unhandled promise rejections → GlobalErrorHandler

## Git & CI/CD

### Commit Hooks (Husky)
- **pre-commit**: runs `lint-staged` (Prettier on modified files)
- **commit-msg**: runs `commitlint` (enforces conventional commits)
- **prepare-commit-msg**: auto-generates commit message from staged files (see scripts/gen-commit-msg.mjs)

### CI Pipeline (.github/workflows/ci.yml)
- Runs `npm run ci:verify` (doctor + build + test + lint)
- Triggered on push to `main` or PR

### Guardrails
scripts/doctor.mjs validates:
- JSON files (package.json, tsconfig*, angular.json, proxy.conf.json)
- Proxy config has `/kpis` target
- Mock API server exists
- json-server module resolvable

Run before any major change: `npm run doctor`

## Key Files to Know
| File | Purpose |
|------|---------|
| src/main.ts | Bootstrap, route config, provider setup |
| src/app/app.component.ts | Root layout + nav bar |
| src/app/kpis/kpis.service.ts | HTTP client for KPI CRUD |
| mocks/db.json | Mock API database (edit for test data) |
| mock-api/server.mjs | JSON server launcher (handles CORS) |
| angular.json | Build + serve config (proxy path in options) |
| eslint.config.js | ESLint rules (Angular + TS + Prettier) |
| jest.config.cjs | Jest runner + preset |

## Common Pitfalls & Tips

1. **State not updating?** Remember `computed()` returns a signal function — call it in template or use `computed(() => ...)` in another computed.
2. **Service not injected?** Use `inject()` at top level in component/service, not inside methods (breaks DI).
3. **Tests failing?** Use `fakeAsync()` + `tick()` for observable delays; provide all mocked services in `TestBed.configureTestingModule()`.
4. **Mock API not running?** Check `npm run mock:api` listens on `127.0.0.1:3001` and proxy.conf.json points to it.
5. **Angular Material not styled?** Ensure src/styles/theme.scss is imported in src/styles.scss.

## Integration Points
- **Backend**: Replace proxy target & KpisService endpoint when deploying to real API
- **CI/CD**: Update .github/workflows/ci.yml to add deploy step
- **Documentation**: Build via `npm run doc:structure` regenerates README_TREE.md
