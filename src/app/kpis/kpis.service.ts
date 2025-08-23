import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Kpi {
  name: string;
  value: number;
}

@Injectable({ providedIn: 'root' })
export class KpisService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api'; // dev proxy to http://localhost:3000

  getKpis(): Observable<Kpi[]> {
    return this.http.get<Kpi[]>(`${this.base}/kpis`);
  }
}
