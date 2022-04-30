import { TestBed } from '@angular/core/testing';

import { EvaluativeMatrixService } from './evaluative-matrix.service';

describe('EvaluativeMatrixService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EvaluativeMatrixService = TestBed.get(EvaluativeMatrixService);
    expect(service).toBeTruthy();
  });
});
