import { Component, inject } from '@angular/core';
import { HttpClient, CommonModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
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
          <label>Email: <input [(ngModel)]="email" name="email" /></label><br/>
          <label>Password: <input type="password" [(ngModel)]="password" name="password" /></label><br/>
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
  `
})
export class AppComponent {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  apiBase = (window as any).__API_BASE__ || 'http://localhost:3000';
  pingResult = '';
  loginResult = '';
  email = '';
  password = '';

  ping() {
    this.http.get(this.apiBase + '/healthz').subscribe({
      next: (res) => this.pingResult = JSON.stringify(res, null, 2),
      error: (err) => this.pingResult = 'Error: ' + err.message
    });
  }

  doLogin() {
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => this.loginResult = JSON.stringify(res, null, 2),
      error: (err) => this.loginResult = 'Error: ' + err.message
    });
  }
}
