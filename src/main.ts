import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { DashboardComponent } from './app/dashboard/dashboard.component';
import { authInterceptor } from './app/shared/auth.interceptor';

const routes: Routes = [
  { path: '', component: DashboardComponent },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled' })),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
  ],
}).catch(err => console.error(err));
