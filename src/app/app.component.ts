import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

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
      <a routerLink="/" style="color:inherit;text-decoration:none;font-weight:600;">MRV</a>
      <span class="spacer"></span>
      <a mat-button routerLink="/dashboard">Dashboard</a>
      <a mat-button routerLink="/login">Login</a>
    </mat-toolbar>

    <router-outlet />
  `,
})
export class AppComponent {}
