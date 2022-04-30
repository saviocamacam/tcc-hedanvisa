import { TestBed } from '@angular/core/testing';

import { SchoolYearService } from './school-year.service';

describe('SchoolYearService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SchoolYearService = TestBed.get(SchoolYearService);
    expect(service).toBeTruthy();
  });
});
