import { ErrorHandler, Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private snack = inject(MatSnackBar);

  handleError(error: unknown): void {
    // Log for dev/telemetry hook
    console.error('Global error:', error);

    const msg =
      error instanceof Error
        ? error.message
        : ((typeof error === 'string' ? error : 'Unexpected error') as string);

    // Non-blocking hint to users
    try {
      this.snack.open(`Unexpected error: ${msg}`, 'Dismiss', { duration: 5000 });
    } catch {
      /* ignore snackbar failures */
    }
  }
}
