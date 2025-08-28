// src/main.ts
import 'zone.js';

import { ErrorHandler, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppComponent } from './app/app.component';
import { HomeComponent } from './app/home/home.component';
import { DashboardComponent } from './app/dashboard/dashboard.component';
import { KpiDetailComponent } from './app/kpis/kpi-detail.component';
import { authGuard } from './app/auth/auth.guard';
import { authInterceptor } from './app/shared/auth.interceptor';
import { errorInterceptor } from './app/shared/error.interceptor';
import { GlobalErrorHandler } from './app/shared/global-error.handler';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  {
    path: 'kpis',
    loadComponent: () => import('./app/kpis/kpis-list.component').then((m) => m.KpisListComponent),
    canActivate: [authGuard],
  },
  { path: 'kpi/:name', component: KpiDetailComponent, canActivate: [authGuard] },
  {
    path: 'login',
    loadComponent: () => import('./app/auth/login.component').then((m) => m.LoginComponent),
  },
];

bootstrapApplication(AppComponent, {
  providers: [
    // Router
    provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled' })),

    // HTTP (both interceptors here)
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),

    // Animations + Material snack bar for toasts
    provideAnimations(),
    importProvidersFrom(MatSnackBarModule),

    // Global error handler
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
}).catch((err) => console.error(err));
// src/app/shared/error.interceptor.ts
