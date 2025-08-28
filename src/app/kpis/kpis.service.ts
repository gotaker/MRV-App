// src/app/kpis/kpis.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Kpi {
  name: string;
  value: number;
  id: number;
}

@Injectable({ providedIn: 'root' })
export class KpisService {
  private http = inject(HttpClient);
  private base = '/kpis'; // proxied to mock API

  getKpis(): Observable<Kpi[]> {
    return this.http.get<Kpi[]>(this.base);
  }
  getKpi(id: number): Observable<Kpi> {
    return this.http
      .get<Kpi[]>(`${this.base}?id=${encodeURIComponent(id)}`)
      .pipe(map((rows) => rows[0]));
  }
  getKpiTrend(id: number): Observable<number[]> {
    return this.http
      .get<{ kpiId: number; points: number[] }[]>(`/kpiTrends?kpiId=${encodeURIComponent(id)}`)
      .pipe(map((rows) => rows[0]?.points ?? []));
  }

  updateKpi(id: number, patch: Partial<Omit<Kpi, 'id'>>): Observable<Kpi> {
    return this.http.patch<Kpi>(`${this.base}/${id}`, patch);
  }

  deleteKpi(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
