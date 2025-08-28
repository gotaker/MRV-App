// src/app/kpis/kpis.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Kpi {
  name: string;
  value: number;
  id: string;
}

@Injectable({ providedIn: 'root' })
export class KpisService {
  private http = inject(HttpClient);
  private base = '/kpis'; // proxied to mock API

  getKpis(): Observable<Kpi[]> {
    return this.http.get<Kpi[]>(this.base);
  }
  getKpi(id: string): Observable<Kpi> {
    return this.http
      .get<Kpi[]>(`${this.base}?id=${encodeURIComponent(id)}`)
      .pipe(map((rows) => rows[0]));
  }
  getKpiTrend(id: string): Observable<number[]> {
    return this.http
      .get<{ kpiId: string; points: number[] }[]>(`/kpiTrends?kpiId=${encodeURIComponent(id)}`)
      .pipe(map((rows) => rows[0]?.points ?? []));
  }
}
