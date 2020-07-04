import { TestBed } from '@angular/core/testing';

import { TransactionsHttpService } from './transactions-http.service';

describe('TransactionsHttpService', () => {
  let service: TransactionsHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionsHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
