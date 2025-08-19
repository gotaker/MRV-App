import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { API_BASE_URL } from '../core/api.token';
import { KpisService, Kpi } from './kpis.service';

describe('KpisService', () => {
  let httpMock: HttpTestingController;
  let svc: KpisService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // modern, standalone-friendly
        provideHttpClientTesting(), // test controller providers
        { provide: API_BASE_URL, useValue: 'http://localhost:3000' },
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
    svc = TestBed.inject(KpisService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('fetches KPIs', () => {
    let result: Kpi[] | undefined;
    const mock: Kpi[] = [
      { id: 1, name: 'Total Emissions (tCO2e)', value: 123 },
      { id: 2, name: 'Energy Intensity (kWh/unit)', value: 3.7 },
    ];

    svc.getKpis().subscribe((v: Kpi[]) => (result = v));

    const req = httpMock.expectOne('http://localhost:3000/kpis');
    expect(req.request.method).toBe('GET');
    req.flush(mock);

    expect(result).toEqual(mock);
  });
});
// This code is a unit test for the KpisService in an Angular application.
