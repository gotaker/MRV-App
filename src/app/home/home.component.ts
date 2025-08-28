import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith } from 'rxjs';
import { KpisService, Kpi } from '../kpis/kpis.service';

// Discriminated union for state
type LoadingState = { kind: 'loading' };
type ErrorState = { kind: 'err'; msg: string };
type OkState<T> = { kind: 'ok'; data: T };
type State<T> = LoadingState | ErrorState | OkState<T>;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule],
  styles: [
    `
      :host {
        display: block;
        padding: 24px;
      }
      .hero {
        display: grid;
        grid-template-columns: 1.1fr 0.9fr;
        gap: 24px;
        align-items: start;
      }
      .title {
        font-size: clamp(28px, 3.5vw, 42px);
        margin: 0 0 8px;
      }
      .subtitle {
        color: #666;
        margin: 0 0 16px;
      }
      .cta {
        display: flex;
        gap: 12px;
        margin-top: 12px;
        flex-wrap: wrap;
      }
      .status {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        padding: 4px 10px;
        border-radius: 999px;
        background: #f3f4f6;
      }
      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
      }
      .ok {
        background: #2e7d32;
      }
      .err {
        background: #c62828;
      }
      .loading {
        background: #f9a825;
      }
      .panel {
        padding: 12px 16px;
        border-radius: 14px;
        background: white;
      }
      .list {
        margin: 0;
        padding-left: 18px;
        color: #555;
      }
      @media (max-width: 900px) {
        .hero {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
  template: `
    <section class="hero">
      <div>
        <h1 class="title">MRV App</h1>
        <p class="subtitle">Measure • Report • Verify — fast KPIs and clean data pipelines.</p>

        <div class="status" *ngIf="loading(); else notLoading">
          <span class="dot loading"></span> Checking API…
        </div>
        <ng-template #notLoading>
          <div class="status" *ngIf="error(); else apiOk">
            <span class="dot err"></span> API offline ({{ error() }})
          </div>
          <ng-template #apiOk>
            <div class="status">
              <span class="dot ok"></span> API online • {{ kpis().length }} KPIs available
            </div>
          </ng-template>
        </ng-template>

        <div class="cta">
          <a mat-flat-button color="primary" routerLink="/dashboard">Open Dashboard</a>
          <a
            mat-stroked-button
            href="https://github.com/gotaker/MRV-App"
            target="_blank"
            rel="noopener"
            >Repo</a
          >
        </div>

        <mat-card class="panel" style="margin-top:16px;" appearance="outlined">
          <mat-card-title>What you can do</mat-card-title>
          <mat-card-content>
            <ul class="list">
              <li>View KPIs fetched from the (mock) API with robust error handling</li>
              <li>Develop against the local JSON server via the Vite/Angular proxy</li>
              <li>Enjoy guardrails: commit hooks, doctor checks, typed state & interceptors</li>
            </ul>
          </mat-card-content>
        </mat-card>
      </div>

      <div>
        <mat-card appearance="outlined">
          <mat-card-header>
            <mat-card-title>Quick glance</mat-card-title>
            <mat-card-subtitle>Latest KPIs (first 4)</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <ng-container *ngIf="kpis().length; else empty">
              <ul class="list">
                <li *ngFor="let k of kpis().slice(0, 4)">
                  {{ k.name }} — <strong>{{ k.value }}</strong>
                </li>
              </ul>
            </ng-container>
            <ng-template #empty>
              <p style="color:#666">No KPIs yet (or API offline).</p>
            </ng-template>
          </mat-card-content>
          <mat-card-actions align="end">
            <a mat-button routerLink="/dashboard">Go to Dashboard</a>
          </mat-card-actions>
        </mat-card>
      </div>
    </section>
  `,
})
export class HomeComponent {
  private svc = inject(KpisService);

  private state = toSignal<State<Kpi[]>>(
    this.svc.getKpis().pipe(
      map<Kpi[], OkState<Kpi[]>>((data) => ({ kind: 'ok', data })),
      catchError((e) =>
        of<ErrorState>({ kind: 'err', msg: (e as Error)?.message ?? 'API unavailable' }),
      ),
      startWith<LoadingState>({ kind: 'loading' }),
    ),
    { requireSync: true },
  );

  loading = computed(() => this.state().kind === 'loading');
  error = computed(() => (this.state().kind === 'err' ? (this.state() as ErrorState).msg : ''));
  kpis = computed<Kpi[]>(() =>
    this.state().kind === 'ok' ? (this.state() as OkState<Kpi[]>).data : [],
  );
}
