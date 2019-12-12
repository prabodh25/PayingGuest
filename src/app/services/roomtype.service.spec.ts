import { TestBed } from '@angular/core/testing';

import { RoomtypeService } from './roomtype.service';

describe('RoomtypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RoomtypeService = TestBed.get(RoomtypeService);
    expect(service).toBeTruthy();
  });
});
