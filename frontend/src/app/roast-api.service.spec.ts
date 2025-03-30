import { TestBed } from '@angular/core/testing';

import { RoastApiService } from './roast-api.service';

describe('RoastApiService', () => {
  let service: RoastApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoastApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
