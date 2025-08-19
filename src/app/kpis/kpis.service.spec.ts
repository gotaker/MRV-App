import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { KpisService } from './kpis.service';

describe('KpisService', () => {
  let httpMock: HttpTestingController;
  let svc: KpisService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        KpisService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
    svc = TestBed.inject(KpisService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(svc).toBeTruthy();
  });

  // Add endpoint tests later when API is settled, e.g.:
  // it('should GET /kpis', () => {
  //   const mock = [{ id: 1, label: 'x', value: 5 }];
  //   svc.getKpis().subscribe(out => expect(out).toEqual(mock));
  //   const req = httpMock.expectOne(r => r.method === 'GET' && r.url.includes('/kpis'));
  //   req.flush(mock);
  // });
});
// Additional tests can be added here as the API evolves