import { TestBed } from '@angular/core/testing';

import { InfoCompaniesService } from './InfoCompanies.service';

describe('ListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InfoCompaniesService = TestBed.get(InfoCompaniesService);
    expect(service).toBeTruthy();
  });
});
