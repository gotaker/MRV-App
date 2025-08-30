import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HomeComponent } from './home.component';
import { KpisService, Kpi } from '../kpis/kpis.service';

class MockKpisService {
  constructor(private mode: 'ok' | 'err' = 'ok') {}
  getKpis() {
    return this.mode === 'ok'
      ? of<Kpi[]>([{ id: 1, name: 'Revenue', value: 123 }])
      : throwError(() => new Error('boom'));
  }
}

function setup(mode: 'ok' | 'err' = 'ok') {
  TestBed.configureTestingModule({
    imports: [HomeComponent],
    providers: [
      provideRouter([{ path: 'dashboard', component: HomeComponent }]),
      { provide: KpisService, useValue: new MockKpisService(mode) },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(HomeComponent);
  fixture.detectChanges();
  return { fixture };
}

describe('HomeComponent', () => {
  it('shows API online + KPIs when service returns data', fakeAsync(() => {
    const { fixture } = setup('ok');
    expect(fixture.nativeElement.textContent).toContain('Checking API');
    tick();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('API online');
    expect(fixture.nativeElement.textContent).toContain('Revenue');
  }));

  it('shows API offline when service errors', fakeAsync(() => {
    const { fixture } = setup('err');
    expect(fixture.nativeElement.textContent).toContain('Checking API');
    tick();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('API offline');
    expect(fixture.nativeElement.textContent).toContain('boom');
  }));
});
