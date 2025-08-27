import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snack = inject(MatSnackBar);

  return next(req).pipe(
    catchError((err: unknown) => {
      let msg = 'Network error';
      if (err instanceof HttpErrorResponse) {
        // prefer API-provided message, fallback to HTTP code
        msg = err.error?.message ?? (err.message || `HTTP ${err.status || 0}`);
      } else if (err instanceof Error) {
        msg = err.message;
      }

      try {
        snack.open(msg, 'Dismiss', { duration: 4000 });
      } catch {
        /* swallow snackbar failures */
      }
      return throwError(() => err);
    }),
  );
};
