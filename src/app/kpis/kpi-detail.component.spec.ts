import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { KpiDetailComponent } from './kpi-detail.component';
import { KpisService, Kpi } from '../kpis/kpis.service';

describe('KpiDetailComponent', () => {
  it('renders KPI name from name route param', () => {
    TestBed.configureTestingModule({
      imports: [KpiDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ name: 'Revenue' })) },
        },
        {
          provide: KpisService,
          useValue: { getKpis: () => of<Kpi[]>([{ id: 1, name: 'Revenue', value: 100 }]) },
        },
      ],
    }).compileComponents();

    const f = TestBed.createComponent(KpiDetailComponent);
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('Revenue');
  });
});
