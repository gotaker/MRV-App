import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <div style="display:grid;place-items:center;height:calc(100dvh - 80px);">
      <mat-card appearance="outlined" style="width:min(420px, 92vw)">
        <mat-card-header><mat-card-title>Sign in</mat-card-title></mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="submit()">
            <mat-form-field appearance="outline" style="width:100%;">
              <mat-label>Username</mat-label>
              <input matInput formControlName="username" autocomplete="username" />
            </mat-form-field>

            <mat-form-field appearance="outline" style="width:100%;">
              <mat-label>Password</mat-label>
              <input
                matInput
                type="password"
                formControlName="password"
                autocomplete="current-password"
              />
            </mat-form-field>

            <div style="display:flex;gap:12px;justify-content:flex-end;">
              <a mat-button routerLink="/">Cancel</a>
              <button mat-flat-button color="primary" [disabled]="form.invalid">Login</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    username: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    password: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
  });

  onSubmit() {
    if (this.form.invalid) return;
    const { username, password } = this.form.getRawValue();
    if (this.auth.login(username, password)) {
      this.router.navigateByUrl('/dashboard');
    }
  }
}
