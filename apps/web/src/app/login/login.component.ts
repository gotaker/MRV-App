import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div style="max-width:360px;margin:6rem auto;font-family:system-ui">
      <h2>Sign in</h2>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <div style="display:flex;flex-direction:column;gap:.5rem">
          <input placeholder="Email" formControlName="email" type="email" required />
          <input placeholder="Password" formControlName="password" type="password" required />
          <button [disabled]="form.invalid || loading" type="submit">Login</button>
          <p *ngIf="error" style="color:#b00">{{error}}</p>
        </div>
      </form>
    </div>
  `
})
export class LoginComponent {
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  router = inject(Router);
  loading = false;
  error = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async submit() {
    this.error = '';
    this.loading = true;
    try {
      await this.auth.login(this.form.value as any);
      this.router.navigateByUrl('/');
    } catch (e: any) {
      this.error = e?.error?.message || e?.message || 'Login failed';
    } finally {
      this.loading = false;
    }
  }
}
