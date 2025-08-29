import { Component, OnInit, ViewChild, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { KpisService, Kpi } from './kpis.service';

@Component({
  selector: 'app-kpis-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  styles: [
    `
      :host {
        display: block;
        padding: 24px;
      }
      .toolbar {
        display: flex;
        gap: 12px;
        align-items: center;
        margin-bottom: 12px;
        flex-wrap: wrap;
      }
      .table-wrap {
        background: white;
        border-radius: 12px;
        overflow: auto;
      }
      table {
        width: 100%;
      }
    `,
  ],
  template: `
    <h1 style="margin:0 0 12px;">KPIs</h1>

    <div class="toolbar">
      <mat-form-field appearance="outline">
        <mat-label>Search</mat-label>
        <input matInput (input)="onFilter($event)" placeholder="Filter by name/value" />
      </mat-form-field>

      <button mat-stroked-button color="primary" (click)="reload()">Refresh</button>
      <button mat-flat-button color="primary" routerLink="/dashboard">Dashboard</button>
    </div>

    <div class="table-wrap" *ngIf="!loading(); else loadingTpl">
      <table mat-table [dataSource]="rows()" matSort matSortDisableClear>
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
          <td mat-cell *matCellDef="let k">{{ k.name }}</td>
        </ng-container>

        <ng-container matColumnDef="value">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Value</th>
          <td mat-cell *matCellDef="let k">{{ k.value }}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef style="width:160px;">Actions</th>
          <td mat-cell *matCellDef="let k">
            <a mat-button color="primary" [routerLink]="['/kpis', k.id]">View</a>
            <button mat-button color="warn" (click)="confirmDelete(k)">Delete</button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="cols"></tr>
        <tr mat-row *matRowDef="let row; columns: cols"></tr>
      </table>

      <mat-paginator [pageSize]="10" [pageSizeOptions]="[5, 10, 25]" showFirstLastButtons />
    </div>

    <ng-template #loadingTpl>
      <p>Loading KPIs…</p>
    </ng-template>
  `,
})
export class KpisListComponent implements OnInit {
  private svc = inject(KpisService);

  cols = ['name', 'value', 'actions'] as const;

  // simple client-side store
  private data = signal<Kpi[]>([]);
  private filter = signal('');
  readonly loading = signal(true);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  rows = computed(() => {
    const f = this.filter().trim().toLowerCase();
    const filtered = !f
      ? this.data()
      : this.data().filter((k) => `${k.name} ${k.value}`.toLowerCase().includes(f));
    // simple sort by current MatSort state (client-side)
    const s = this.sort;
    if (!s || !s.active || s.direction === '') return filtered;
    const dir = s.direction === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = a[s.active as keyof Kpi];
      const bv = b[s.active as keyof Kpi];
      return av < bv ? -1 * dir : av > bv ? 1 * dir : 0;
    });
  });

  ngOnInit(): void {
    this.reload();
  }

  onFilter(e: Event) {
    const val = (e.target as HTMLInputElement).value ?? '';
    this.filter.set(val);
  }

  reload() {
    this.loading.set(true);
    this.svc.getKpis().subscribe({
      next: (list) => {
        this.data.set(list ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.data.set([]);
        this.loading.set(false);
      },
    });
  }

  confirmDelete(k: Kpi) {
    if (!k?.id) return;
    if (confirm(`Delete KPI "${k.name}"?`)) {
      this.svc.deleteKpi(k.id).subscribe({
        next: () => this.data.set(this.data().filter((x) => x.id !== k.id)),
        error: () => alert('Delete failed.'),
      });
    }
  }
}
