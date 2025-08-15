import { withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideRouter([]),
  ]
};
