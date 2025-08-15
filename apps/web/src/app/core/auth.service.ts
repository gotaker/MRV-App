import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from './api.config';

export interface LoginDto { email: string; password: string; }
export interface User { id: string; email: string; name?: string; roles?: string[]; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  user = signal<User | null>(null);

  async login(dto: LoginDto) {
    const res: any = await this.http.post(`${API_BASE}/auth/login`, dto).toPromise();
    if (res?.accessToken) {
      localStorage.setItem('access_token', res.accessToken);
    }
    const me = await this.http.get<User>(`${API_BASE}/auth/me`).toPromise();
    this.user.set(me ?? null);
    return me;
  }

  async logout() {
    try { await this.http.post(`${API_BASE}/auth/logout`, {}, { withCredentials: true }).toPromise(); } catch {}
    localStorage.removeItem('access_token');
    this.user.set(null);
  }

  async refresh() {
    const res: any = await this.http.post(`${API_BASE}/auth/refresh`, {}, { withCredentials: true }).toPromise();
    if (res?.accessToken) localStorage.setItem('access_token', res.accessToken);
    return res;
  }

  async me() {
    const me = await this.http.get<User>(`${API_BASE}/auth/me`).toPromise().catch(() => null);
    this.user.set(me);
    return me;
  }

  isAuthenticated() { return !!this.user(); }
}
