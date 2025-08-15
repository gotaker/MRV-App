// src/app/app.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main style="font-family: system-ui, sans-serif; padding: 2rem">
      <h1>MRV Web – Angular 20</h1>

      <section style="margin-bottom: 2rem;">
        <h2>Login</h2>
        <form (ngSubmit)="doLogin()">
          <label>Email:
            <input [(ngModel)]="email" name="email" required />
          </label>
          <br />
          <label>Password:
            <input type="password" [(ngModel)]="password" name="password" required />
          </label>
          <br />
          <button type="submit">Login</button>
        </form>
        <div *ngIf="loginResult">
          <strong>Login Result:</strong>
          <pre>{{ loginResult }}</pre>
        </div>
      </section>

      <section>
        <h2>API Ping</h2>
        <button (click)="ping()">Ping API /healthz</button>
        <pre>{{ pingResult }}</pre>
      </section>
    </main>
  `,
})
export class AppComponent {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  // Use the dev proxy so requests go to the Docker "api" service
  // (we set this up in proxy.conf.json)
  readonly apiBase = '/api';

  pingResult = '';
  loginResult = '';
  email = '';
  password = '';

  ping() {
    this.http.get(this.apiBase + '/healthz').subscribe({
      next: (res) => (this.pingResult = JSON.stringify(res, null, 2)),
      error: (err) => (this.pingResult = 'Error: ' + (err?.message ?? err)),
    });
  }

  // Choose ONE of the following patterns depending on your AuthService:

  // A) If AuthService.login returns an Observable
  doLogin() {
    // Expected signature: login(email: string, password: string): Observable<any>
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => (this.loginResult = JSON.stringify(res, null, 2)),
      error: (err) => (this.loginResult = 'Error: ' + (err?.message ?? err)),
    });
  }

  // B) If AuthService.login expects an object and returns a Promise (our earlier scaffold)
  // async doLogin() {
  //   this.loginResult = '';
  //   try {
  //     const res = await this.auth.login({ email: this.email, password: this.password });
  //     this.loginResult = JSON.stringify(res, null, 2);
  //   } catch (err: any) {
  //     this.loginResult = 'Error: ' + (err?.message ?? err);
  //   }
  // }
}