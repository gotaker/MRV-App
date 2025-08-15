import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiBase = (window as any).__API_BASE__ || 'http://localhost:3000';

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiBase}/auth/login`, { email, password }, { withCredentials: true })
      .pipe(tap(res => {
        console.log('Logged in:', res);
      }));
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiBase}/auth/logout`, {}, { withCredentials: true });
  }

  me(): Observable<any> {
    return this.http.get(`${this.apiBase}/auth/me`, { withCredentials: true });
  }
}
