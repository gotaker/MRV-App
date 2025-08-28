import { Injectable, signal } from '@angular/core';

export type User = { username: string; token: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private read(): User | null {
    try {
      return JSON.parse(localStorage.getItem('auth') ?? 'null');
    } catch {
      return null;
    }
  }
  user = signal<User | null>(this.read());

  get token(): string | null {
    return this.user()?.token ?? null;
  }

  login(username: string, password: string) {
    // Mock: accept anything and mint a fake token
    const token = btoa(`${username}:${Date.now()}`);
    const user: User = { username, token };
    localStorage.setItem('auth', JSON.stringify(user));
    this.user.set(user);
  }

  logout() {
    localStorage.removeItem('auth');
    this.user.set(null);
  }
}
