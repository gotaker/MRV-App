import { Injectable, computed, signal } from '@angular/core';

export type User = { username: string; token: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _token = signal<string | null>(localStorage.getItem('token'));

  private read(): User | null {
    try {
      return JSON.parse(localStorage.getItem('auth') ?? 'null');
    } catch {
      return null;
    }
  }

  // signal holds current user (or null)
  user = signal<User | null>(this.read());

  // derived signals
  token = computed(() => this._token());
  isAuthed = computed(() => !!this._token());

  login(username: string, _password: string): boolean {
    // Mock: accept anything and mint a fake token
    const token = btoa(`${username}:${Date.now()}`);
    const user: User = { username, token };

    // persist
    localStorage.setItem('auth', JSON.stringify(user));
    localStorage.setItem('token', token);

    // update signals
    this.user.set(user);
    this._token.set(token);
    return true;
  }

  logout(): void {
    localStorage.removeItem('auth');
    localStorage.removeItem('token');
    this.user.set(null);
    this._token.set(null);
  }
}
