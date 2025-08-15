import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main style="padding:2rem;font-family:system-ui">
      <h1>MRV Dashboard</h1>
      <p *ngIf="!auth.user()">You are not logged in. <a routerLink="/login">Login</a></p>
      <section *ngIf="auth.user()">
        <p>Welcome, {{auth.user()?.email}}</p>
        <button (click)="logout()">Logout</button>
      </section>
    </main>
  `
})
export class HomeComponent {
  auth = inject(AuthService);
  logout(){ this.auth.logout(); }
}
