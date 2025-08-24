export type LoadingState = { kind: 'loading' };
export type ErrorState   = { kind: 'err'; msg: string };
export type OkState<T>   = { kind: 'ok'; data: T };
export type State<T>     = LoadingState | ErrorState | OkState<T>;

import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { KpisService, Kpi } from '../kpis/kpis.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, startWith, map } from 'rxjs';

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
        <mat-card-header><mat-card-title>{{ k.name }}</mat-card-title></mat-card-header>
        <mat-card-content><p style="font-size:28px;margin:8px 0">{{ k.value }}</p></mat-card-content>
      </mat-card>

      <mat-card *ngIf="error()" appearance="outlined" style="border-color:#f44336">
        <mat-card-header><mat-card-title>API Error</mat-card-title></mat-card-header>
        <mat-card-content><p>{{ error() }}</p></mat-card-content>
      </mat-card>
    </div>
  `,
})
export class DashboardComponent {
  private svc = inject(KpisService);

  private state = toSignal<OkState<Kpi[]> | ErrorState | LoadingState>(
    this.svc.getKpis().pipe(
      map<Kpi[], OkState<Kpi[]>>((kpis) => ({ kind: 'ok', data: kpis })),
      catchError((e) => of<ErrorState>({ kind: 'err', msg: e?.message ?? 'Failed to load KPIs' })),
      startWith<LoadingState>({ kind: 'loading' }),
    ),
    { initialValue: { kind: 'loading' } as LoadingState },
  );

  loading = computed(() => this.state().kind === 'loading');
  error = computed(() => (this.state().kind === 'err' ? (this.state() as ErrorState).msg : ''));
  kpis = computed<Kpi[]>(() => (this.state().kind === 'ok' ? (this.state() as OkState<Kpi[]>).data : []));
}
