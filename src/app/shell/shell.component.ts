import { Component, ViewChild, signal } from '@angular/core';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [MatSidenavModule, MatToolbarModule, MatIconModule, MatListModule, MatButtonModule, RouterModule],
  styles: [`
    .app-container { height: 100vh; display: grid; grid-template-rows: auto 1fr; }
    .toolbar-spacer { flex: 1 1 auto; }
    mat-sidenav { width: 280px; }
    .content { padding: 16px; }
  `],
  template: `
  <div class="app-container">
    <mat-toolbar color="primary">
      <button mat-icon-button (click)="toggleSidenav()"><mat-icon>menu</mat-icon></button>
      <span>MRV App</span>
      <span class="toolbar-spacer"></span>
      <button mat-button (click)="toggleTheme()">
        <mat-icon aria-hidden="true">{{ theme() === 'light' ? 'dark_mode' : 'light_mode' }}</mat-icon>
        {{ theme() === 'light' ? 'Dark' : 'Light' }}
      </button>
    </mat-toolbar>

    <mat-sidenav-container>
      <mat-sidenav #snav mode="side" [opened]="true">
        <mat-nav-list>
          <a mat-list-item routerLink="/">Dashboard</a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  </div>
  `
})
export class ShellComponent {
  @ViewChild('snav') snav?: MatSidenav;
  theme = signal<'light' | 'dark'>('light');
  toggleSidenav() { this.snav?.toggle(); }
  toggleTheme() {
    const next = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(next);
    document.documentElement.classList.toggle('dark-theme', next === 'dark');
  }
}
