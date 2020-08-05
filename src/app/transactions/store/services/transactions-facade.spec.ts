import { inject, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import * as fromActions from '../actions';
import * as fromReducers from '../reducers';
import { TransactionsFacadeService } from './transactions-facade.service';

let storeStub;

const providers = [
  Store,
];
const imports = [
  StoreModule.forRoot({})
];

fdescribe('TransactionsFacadeService', () => {
  let service: TransactionsFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports,
      providers,
    });
    service = TestBed.inject(TransactionsFacadeService);
  });

  beforeEach(() => {
    storeStub = TestBed.get(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when createTransaction', whenCreateTransaction);
  describe('when deleteTransaction', whenDeleteTransaction);
  describe('when readTransactions', whenRadTransactions);
  describe('when updateTransaction', whenUpdateTransaction);
});

function whenCreateTransaction() {
  let service: TransactionsFacadeService;

  beforeEach(inject([Store],
    (store: Store<fromReducers.MainState>) => {
      service = new TransactionsFacadeService(store);
    }));

  it(`should call 'dispatch' method with provided TransactionPayload when 'createTransaction' is called `, () => {
    const dispatchSpy = spyOn(storeStub, 'dispatch');
    const payload = {
      key: 'string',
      value: null,
      uid: 'string',
    };
    const action = new fromActions.CreateTransaction(payload);

    service.createTransaction(payload);
    expect(dispatchSpy).toHaveBeenCalledWith(action);
  });
}

function whenDeleteTransaction() {
  let service: TransactionsFacadeService;

  beforeEach(inject([Store],
    (store: Store<fromReducers.MainState>) => {
      service = new TransactionsFacadeService(store);
    }));

  it(`should call 'dispatch' method with provided TransactionPayload when 'deleteTransaction' is called `, () => {
    const dispatchSpy = spyOn(storeStub, 'dispatch');
    const payload = {
      key: 'string',
      value: null,
      uid: 'string',
    };
    const action = new fromActions.DeleteTransaction(payload);

    service.deleteTransaction(payload);
    expect(dispatchSpy).toHaveBeenCalledWith(action);
  });
}

function whenRadTransactions() {
  let service: TransactionsFacadeService;

  beforeEach(inject([Store],
    (store: Store<fromReducers.MainState>) => {
      service = new TransactionsFacadeService(store);
    }));

  it(`should call 'dispatch' method with provided TransactionPayload when 'readTransactions' is called `, () => {
    const dispatchSpy = spyOn(storeStub, 'dispatch');
    const payload = {
      uid: '1234',
      query: { category: 'test'},
    };
    const action = new fromActions.ReadTransactions(payload);

    service.readTransactions('1234', { category: 'test'});
    expect(dispatchSpy).toHaveBeenCalledWith(action);
  });
}

function whenUpdateTransaction() {
  let service: TransactionsFacadeService;

  beforeEach(inject([Store],
    (store: Store<fromReducers.MainState>) => {
      service = new TransactionsFacadeService(store);
    }));

  it(`should call 'dispatch' method with provided TransactionPayload when 'updateTransaction' is called `, () => {
    const dispatchSpy = spyOn(storeStub, 'dispatch');
    const payload = {
      key: 'string',
      value: null,
      uid: 'string',
    };
    const action = new fromActions.UpdateTransaction(payload);

    service.updateTransaction(payload);
    expect(dispatchSpy).toHaveBeenCalledWith(action);
  });
}
