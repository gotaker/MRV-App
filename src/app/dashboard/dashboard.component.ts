import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, catchError, startWith } from 'rxjs/operators';
import { of } from 'rxjs';
import { KpisService, Kpi } from '../kpis/kpis.service';

/** Discriminated union for request state */
export type State<T> = { kind: 'loading' } | { kind: 'ok'; data: T } | { kind: 'err'; msg: string };

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;">
      <mat-card *ngIf="loading()" appearance="outlined">
        <mat-card-header><mat-card-title>Loading…</mat-card-title></mat-card-header>
        <mat-card-content><p>Please wait.</p></mat-card-content>
      </mat-card>

      <mat-card *ngFor="let k of kpis()" appearance="outlined">
        <mat-card-header
          ><mat-card-title>{{ k.name }}</mat-card-title></mat-card-header
        >
        <mat-card-content
          ><p style="font-size:28px; margin:8px 0;">{{ k.value }}</p></mat-card-content
        >
      </mat-card>

      <mat-card *ngIf="error()" appearance="outlined" style="border-color:#f44336">
        <mat-card-header><mat-card-title>API Error</mat-card-title></mat-card-header>
        <mat-card-content
          ><p>{{ error() }}</p></mat-card-content
        >
      </mat-card>
    </div>
  `,
})
export class DashboardComponent {
  private readonly svc = inject(KpisService);

  // Observable -> Signal: ensure a synchronous initial value with startWith('loading')
  private readonly kpisState$ = this.svc.getKpis().pipe(
    map((data) => ({ kind: 'ok', data }) as const),
    startWith({ kind: 'loading' } as const),
    catchError((e) => of({ kind: 'err', msg: e?.message ?? 'Failed to load KPIs' } as const)),
  );

  // requireSync is safe because startWith above provides the initial emission synchronously.
  state = toSignal<State<Kpi[]>>(this.kpisState$, { requireSync: true });

  loading = computed(() => this.state().kind === 'loading');

  error = computed(() => {
    const s = this.state();
    return s.kind === 'err' ? s.msg : '';
  });

  kpis = computed<Kpi[]>(() => {
    const s = this.state();
    return s.kind === 'ok' ? s.data : [];
  });
}
