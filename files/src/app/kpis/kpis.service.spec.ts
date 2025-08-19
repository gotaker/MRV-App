import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { describe, it, beforeEach, afterEach, expect } from '@jest/globals';

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
});
