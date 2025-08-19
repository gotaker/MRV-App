import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../core/api.token';

export interface Kpi {
  id: number;
  name: string;
  value: number;
}

@Injectable({ providedIn: 'root' })
export class KpisService {
  private http = inject(HttpClient);
  private base = inject(API_BASE_URL);

  getKpis() {
    return this.http.get<Kpi[]>(`${this.base}/kpis`);
  }
}
