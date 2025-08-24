import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Kpi {
  name: string;
  value: number;
}

@Injectable({ providedIn: 'root' })
export class KpisService {
  private http = inject(HttpClient);
  private base = (globalThis as any).__env?.API_BASE_URL ?? 'http://localhost:3000';

  getKpis(): Observable<Kpi[]> {
    return this.http.get<Kpi[]>(`${this.base}/kpis`);
  }
}
