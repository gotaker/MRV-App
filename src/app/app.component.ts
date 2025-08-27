import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  styles: [
    `
      header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        border-bottom: 1px solid #eee;
      }
      a.brand {
        font-weight: 700;
        text-decoration: none;
        color: inherit;
      }
      nav a {
        margin-left: 12px;
        text-decoration: none;
        color: #3f51b5;
      }
      main {
        min-height: calc(100vh - 60px);
      }
    `,
  ],
  template: `
    <header>
      <a class="brand" routerLink="/">MRV App</a>
      <nav>
        <a routerLink="/dashboard">Dashboard</a>
        <a href="https://github.com/gotaker/MRV-App" target="_blank" rel="noopener">Repo</a>
      </nav>
    </header>

    <main>
      <router-outlet />
    </main>
  `,
})
export class AppComponent {}
