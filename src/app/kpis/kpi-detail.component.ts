import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { KpisService, Kpi } from './kpis.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, map, startWith } from 'rxjs';
import { switchMap } from 'rxjs';

type Loading = { kind: 'loading' };
type Err = { kind: 'err'; msg: string };
type Ok = { kind: 'ok'; kpi: Kpi; trend: number[] };
type State = Loading | Err | Ok;

@Component({
  standalone: true,
  selector: 'app-kpi-detail',
  imports: [CommonModule, MatCardModule, RouterLink],
  styles: [
    `
      .sparkline {
        width: 100%;
        height: 80px;
      }
      .meta {
        color: #666;
        font-size: 14px;
      }
    `,
  ],
  template: `
    <a routerLink="/dashboard" style="text-decoration:none;">← Back to Dashboard</a>

    <mat-card appearance="outlined" style="margin-top:12px;">
      <ng-container [ngSwitch]="state().kind">
        <div *ngSwitchCase="'loading'">Loading…</div>
        <div *ngSwitchCase="'err'">{{ (state() as Err).msg }}</div>
        <ng-container *ngSwitchCase="'ok'">
          <mat-card-header>
            <mat-card-title>{{ (state() as Ok).kpi.name }}</mat-card-title>
            <mat-card-subtitle class="meta"
              >Current value: {{ (state() as Ok).kpi.value }}</mat-card-subtitle
            >
          </mat-card-header>
          <mat-card-content>
            <svg class="sparkline" viewBox="0 0 300 80" preserveAspectRatio="none">
              <path [attr.d]="path()" fill="none" stroke="#1976d2" stroke-width="2"></path>
            </svg>
          </mat-card-content>
        </ng-container>
      </ng-container>
    </mat-card>
  `,
})
export class KpiDetailComponent {
  private route = inject(ActivatedRoute);
  private svc = inject(KpisService);

  private id = signal<string>('');
  private data$ = this.route.paramMap.pipe(
    map((pm) => pm.get('id') ?? ''),
    map((v) => this.id.set(v)),
    startWith(null as unknown as void),
    map(() => this.id()), // trigger recompute
  );

  private stateSig = toSignal<State>(
    combineLatest([this.data$]).pipe(
      // when id changes, fetch both
      map(() => this.id()),
      switchMap((id) =>
        combineLatest([this.svc.getKpi(id), this.svc.getKpiTrend(id)]).pipe(
          map(([kpi, trend]) => ({ kind: 'ok', kpi, trend }) as State),
          startWith({ kind: 'loading' } as State),
        ),
      ),
    ),
    { requireSync: true },
  );

  state = computed(() => this.stateSig());

  // Build an SVG path for the sparkline
  path = computed(() => {
    const s = this.state();
    if (s.kind !== 'ok' || !s.trend.length) return '';
    const pts = s.trend;
    const w = 300,
      h = 80;
    const min = Math.min(...pts),
      max = Math.max(...pts);
    const span = Math.max(1, max - min);
    const stepX = pts.length > 1 ? w / (pts.length - 1) : w;
    const y = (v: number) => h - ((v - min) / span) * (h - 6) - 3; // small padding
    return pts.map((v, i) => `${i ? 'L' : 'M'}${i * stepX},${y(v)}`).join(' ');
  });
}
