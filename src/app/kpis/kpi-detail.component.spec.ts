import { TestBed } from '@angular/core/testing';
import { KpiDetailComponent } from './kpi-detail.component';
import { KpisService } from './kpis.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

const mockSvc = {
  getKpi: () => of({ id: 'revenue', name: 'Revenue', value: 123 }),
  getKpiTrend: () => of([100, 110, 120, 123]),
};

describe('KpiDetailComponent', () => {
  it('renders KPI name and builds a path', async () => {
    await TestBed.configureTestingModule({
      imports: [KpiDetailComponent],
      providers: [
        { provide: KpisService, useValue: mockSvc },
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(new Map([['id', 'revenue']]) as any) },
        },
      ],
    }).compileComponents();

    const f = TestBed.createComponent(KpiDetailComponent);
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('Revenue');
    const d = f.componentInstance.path();
    expect(d.startsWith('M')).toBeTruthy();
  });
});
