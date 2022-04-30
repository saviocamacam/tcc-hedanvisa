import { TestBed } from '@angular/core/testing';

import { ProfessorProfileService } from './professor-profile.service';

describe('ProfessorProfileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProfessorProfileService = TestBed.get(ProfessorProfileService);
    expect(service).toBeTruthy();
  });
});
