import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { KpisService, Kpi } from '../kpis/kpis.service';

type Loading = { kind: 'loading' };
type Err = { kind: 'err'; msg: string };
type Ok = { kind: 'ok'; kpi: Kpi };
type State = Loading | Err | Ok;

@Component({
  selector: 'app-kpi-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card appearance="outlined">
      <ng-container [ngSwitch]="viewKind()">
        <mat-card-header *ngSwitchCase="'loading'">
          <mat-card-title>Loading…</mat-card-title>
        </mat-card-header>

        <mat-card-header *ngSwitchCase="'err'">
          <mat-card-title>Failed to load KPI</mat-card-title>
          <mat-card-subtitle>{{ errMsg() }}</mat-card-subtitle>
        </mat-card-header>

        <ng-container *ngSwitchCase="'ok'">
          <mat-card-header>
            <mat-card-title>{{ kpi()?.name }}</mat-card-title>
            <mat-card-subtitle>Current value: {{ kpi()?.value }}</mat-card-subtitle>
          </mat-card-header>
        </ng-container>
      </ng-container>
    </mat-card>
  `,
})
export class KpiDetailComponent {
  private route = inject(ActivatedRoute);
  private svc = inject(KpisService);

  public path(): string {
    const s = this.state();
    return s && s.kind === 'ok' ? `/kpis/${s.kpi.id}` : '';
  }

  // Stream state -> signal, no casts in template
  private state = toSignal<State>(
    this.route.paramMap.pipe(
      map((pm) => pm.get('name') ?? pm.get('id') ?? ''),
      switchMap((key) =>
        this.svc.getKpis().pipe(
          map<Kpi[], State>((list) => {
            const found = list.find((k) => k.name === key);
            if (!found) throw new Error('Not found');
            return { kind: 'ok', kpi: found } as Ok;
          }),
          startWith<Loading>({ kind: 'loading' }),
          catchError((e) => of<Err>({ kind: 'err', msg: (e as Error)?.message ?? 'Failed' })),
        ),
      ),
    ),
    { requireSync: true },
  );

  // Template-friendly derived getters
  readonly viewKind = computed(() => this.state().kind);
  readonly errMsg = computed(() => (this.state().kind === 'err' ? (this.state() as Err).msg : ''));
  readonly kpi = computed<Kpi | null>(() =>
    this.state().kind === 'ok' ? (this.state() as Ok).kpi : null,
  );
}
