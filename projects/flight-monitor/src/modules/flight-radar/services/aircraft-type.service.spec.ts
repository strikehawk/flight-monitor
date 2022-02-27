import { TestBed } from '@angular/core/testing';

import { AircraftTypeService } from './aircraft-type.service';

describe('AircraftTypeService', () => {
  let service: AircraftTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AircraftTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
