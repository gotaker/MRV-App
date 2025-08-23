# Fix for `dashboard.component.ts` TypeScript parse error (':' expected)

Replace the **typed state block and computed accessors** as shown below, and ensure `toSignal` is initialized with `requireSync: true` and an upstream `startWith(...)`.

## 1) Typed state + guards

```ts
export type LoadingState = { kind: 'loading' };
export type ErrorState = { kind: 'err'; msg: string };
export type OkState<T> = { kind: 'ok'; data: T };
export type State<T> = LoadingState | ErrorState | OkState<T>;

function isErr<T>(s: State<T>): s is ErrorState {
  return s.kind === 'err';
}
function isOk<T>(s: State<T>): s is OkState<T> {
  return s.kind === 'ok';
}
```

> Make sure the object members use a colon (e.g. `kind: 'loading'`) and end each property with a semicolon.

## 2) Signal creation

```ts
import { toSignal } from '@angular/core/rxjs-interop';
import { map, catchError, startWith } from 'rxjs/operators';
import { of } from 'rxjs';

private readonly kpisState$ = this.kpisService.getKpis().pipe(
  map((data) => ({ kind: 'ok', data }) as const),
  startWith({ kind: 'loading' } as const),
  catchError(() => of({ kind: 'err', msg: 'Failed to load KPIs' } as const)),
);

state = toSignal<State<Kpi[]>>(this.kpisState$, { requireSync: true });
```

## 3) Computed accessors (narrow first)

```ts
loading = computed(() => this.state().kind === 'loading');

error = computed(() => {
  const s = this.state();
  return isErr(s) ? s.msg : '';
});

kpis = computed<Kpi[]>(() => {
  const s = this.state();
  return isOk(s) ? s.data : [];
});
```

## 4) Remove duplicates

Delete any other `type State = ...` union at the bottom of the file to avoid conflicts.

---

After editing:

```powershell
npm run lint
npm start
```
