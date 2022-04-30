import { TestBed } from '@angular/core/testing';

import { QuestionsDatabaseService } from './questions-database.service';

describe('QuestionsDatabaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuestionsDatabaseService = TestBed.get(QuestionsDatabaseService);
    expect(service).toBeTruthy();
  });
});
