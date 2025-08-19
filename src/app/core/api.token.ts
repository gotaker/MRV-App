import { InjectionToken } from '@angular/core';

declare global {
  interface Window {
    __API_BASE_URL__?: string;
  }
}

/**
 * Base URL for the MRV API. Defaults to http://localhost:3000 (json-server).
 * Can be overridden at runtime by setting window.__API_BASE_URL__ in index.html.
 */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () =>
    (typeof window !== 'undefined' && window.__API_BASE_URL__) || 'http://localhost:3000',
});
