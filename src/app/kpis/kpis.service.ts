// src/app/kpis/kpis.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Kpi { name: string; value: number; }

@Injectable({ providedIn: 'root' })
export class KpisService {
  private http = inject(HttpClient);

  getKpis(): Observable<Kpi[]> {
    // Relative path -> goes through Angular’s dev proxy; no CORS headaches
    return this.http.get<Kpi[]>('/kpis');
  }
}
