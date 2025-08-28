// src/app/auth/login.component.spec.ts
import { TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from './auth.service';

class MockAuth extends AuthService {
  override login() {}
}

describe('LoginComponent', () => {
  it('renders', async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [{ provide: AuthService, useClass: MockAuth }],
    }).compileComponents();

    const f = TestBed.createComponent(LoginComponent);
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('Sign in');
  });
});
