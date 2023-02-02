import { TestBed } from '@angular/core/testing';

import { DataBase } from './data.service';

describe('DataService', () => {
  let service: DataBase;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataBase);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
