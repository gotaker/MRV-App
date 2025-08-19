# Application Architecture (Upgraded)

The diagram shows the upgraded Angular 20 app internals and how it communicates with APIs, test harnesses, and theming.

```mermaid
flowchart TB
  subgraph UI[Presentation Layer]
    Shell[ShellComponent (standalone)\nMaterial 3 theme\nToolbar, Sidenav, Snackbar]
    Router[Angular Router (provideRouter)\nLazy feature routes]
    Views[Feature Views (standalone)\nDashboard, Reports, GHG, MRV Tracking]
    Shared[Shared UI (standalone)\nPipes, Dialogs, Data-Table]
  end

  subgraph Domain[Domain & Services]
    KpisSvc[KpisService\nfetch KPIs]
    AuthSvc[AuthService\nlogin/session]
    UtilSvc[UtilityService]
    State[Signals & Derived Computed\n{ loading | ok | err } unions]
  end

  subgraph Infra[Infrastructure]
    Http[HttpClient (provideHttpClient)\nwithInterceptors(...)]
    ApiToken[API_BASE_URL token\nreads window.__API_BASE_URL__]
    Config[Runtime Config bootstrap]
    Interceptors[Auth/Errors/Logging Interceptors]
  end

  subgraph Data[External]
    API[(MRV API or Mock API)]
  end

  Shell --> Router --> Views
  Views --> Shared
  Views --> KpisSvc
  Views --> AuthSvc
  KpisSvc --> Http --> API
  AuthSvc --> Http
  Http --> ApiToken
  State -.-> Views
  Interceptors -.-> Http

  classDef box fill:#eef7ff,stroke:#268bd2,stroke-width:1px
  classDef infra fill:#f6f6f6,stroke:#999,stroke-width:1px,stroke-dasharray:3 2
  class Shell,Router,Views,Shared,KpisSvc,AuthSvc,UtilSvc,State box
  class Http,ApiToken,Config,Interceptors infra
```

**Testing**
- **Unit (Jest 29)**: Component/service tests, Http testing via `provideHttpClientTesting()`.
- **E2E (Cypress 13)**: Docker runner (Node 22), waits on `tcp:web:4200`, baseUrl from compose.

**Theming**
- Material 3 (`mat.define-theme`), light/dark palettes, typography scale, density tokens.

**Runtime Config**
- `API_BASE_URL` resolved at runtime (`window.__API_BASE_URL__`), enabling per-env API endpoints without rebuilds.
