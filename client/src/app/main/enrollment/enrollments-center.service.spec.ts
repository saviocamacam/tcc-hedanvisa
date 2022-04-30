import { TestBed } from '@angular/core/testing';

import { EnrollmentsCenterService } from './enrollments-center.service';

describe('EnrollmentsCenterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnrollmentsCenterService = TestBed.get(EnrollmentsCenterService);
    expect(service).toBeTruthy();
  });
});
