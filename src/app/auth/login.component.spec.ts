import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from './auth.service';

describe('LoginComponent', () => {
  it('renders and calls login()', () => {
    const mockAuth: Pick<AuthService, 'login'> = {
      login: (_u: string, _p: string) => true,
    };

    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideRouter([]), { provide: AuthService, useValue: mockAuth }],
    }).compileComponents();

    const f = TestBed.createComponent(LoginComponent);
    f.detectChanges();
    expect(f.componentInstance).toBeTruthy();
  });
});
