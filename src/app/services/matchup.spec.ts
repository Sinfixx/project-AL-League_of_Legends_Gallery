import { TestBed } from '@angular/core/testing';

import { Matchup } from '../matchup';

describe('Matchup', () => {
  let service: Matchup;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Matchup);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
