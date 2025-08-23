# PATCH_NOTES

This bundle fixes current build issues:

1. **Material 3 Theme + Global Styles**
   - Adds `src/styles.scss` and corrected `src/styles/theme.scss` (uses supported palettes).
   - If `angular.json` still points to `src/styles.css`, change it to `src/styles.scss`.

2. **Optional RouterOutlet cleaner**
   - Run: `node scripts\fix-router-outlet.cjs` to remove unused RouterOutlet import/array entry if you don't use `<router-outlet>`.

3. **Dashboard state fixes (manual paste)**
   Open `src/app/dashboard/dashboard.component.ts` and make the following edits:
   - Define typed state and guards:

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

   - Build the observable with a synchronous first value and convert with `requireSync`:

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

   - Narrow in computed accessors:

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

   - Remove any duplicate `type State = ...` union at the bottom of the file if present.
