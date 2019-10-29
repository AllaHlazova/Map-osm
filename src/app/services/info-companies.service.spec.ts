import {TestBed} from '@angular/core/testing';
import {InfoCompaniesService} from './info-companies.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('ListService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule ]}));

  it('should be created', () => {
    const service: InfoCompaniesService = TestBed.get(InfoCompaniesService);
    expect(service).toBeTruthy();
  });
});
