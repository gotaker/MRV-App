import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HomeComponent } from './home.component';
import { KpisService, Kpi } from '../kpis/kpis.service';

class MockKpisService implements Partial<KpisService> {
  constructor(private mode: 'ok' | 'err' = 'ok') {}
  getKpis() {
    return this.mode === 'ok'
      ? of<Kpi[]>([{ name: 'Revenue', value: 123 }])
      : throwError(() => new Error('boom'));
  }
}

function setup(mode: 'ok' | 'err' = 'ok') {
  TestBed.configureTestingModule({
    imports: [HomeComponent],
    providers: [{ provide: KpisService, useValue: new MockKpisService(mode) }],
  });
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
