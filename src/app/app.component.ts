import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule],
  styles: [
    `
      .spacer {
        flex: 1;
      }
    `,
  ],
  template: `
    <mat-toolbar color="primary">
      <a routerLink="/" style="color:white;text-decoration:none;font-weight:600;">MRV</a>
      <span class="spacer"></span>
      <a mat-button routerLink="/dashboard">Dashboard</a>
      <a mat-button routerLink="/kpis">KPIs</a>
      <span class="spacer"></span>
      <button *ngIf="!authed()" mat-button routerLink="/login">Login</button>
      <button *ngIf="authed()" mat-button (click)="logout()">Logout</button>
    </mat-toolbar>
    <router-outlet />
  `,
})
export class AppComponent {
  private auth = inject(AuthService);

  authed() {
    return this.auth.isAuthed();
  }

  logout() {
    this.auth.logout();
  }
}
