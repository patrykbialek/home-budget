import { OverlayModule } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '@authentication/models';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { TransactionsHttpService } from '../../services';
import * as fromActions from '../actions';
import { TransactionsEffects } from './transactions.effect';
import { TransactionPayload } from '@transactions/models';

const mockTransaction: TransactionPayload = {
  key: 'string',
  value: null,
};

fdescribe('Transactions Effects', () => {
  let scheduler: TestScheduler;
  let transactionsEffects: TransactionsEffects;
  let actions$: Observable<Action>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let transactionsHttpServiceSpy: jasmine.SpyObj<TransactionsHttpService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        OverlayModule,
      ],
      providers: [
        TransactionsEffects,
        MatSnackBar,
        provideMockActions(() => actions$),
        {
          provide: TransactionsHttpService,
          useValue: jasmine.createSpyObj('TransactionsHttpService',
            ['createTransaction', 'deleteTransaction', 'readTransactions', 'updateTransaction'])
        }
      ]
    });

    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    transactionsEffects = TestBed.get(TransactionsEffects);
    transactionsHttpServiceSpy = TestBed.get(TransactionsHttpService);
    snackBarSpy = TestBed.get(MatSnackBar);
  });

  describe('createTransaction$', () => {
    describe('When fetch success', () => {
      it('should return CreateTransaction action', () => {
        scheduler.run(({ hot, cold, expectObservable }) => {
          const createTransactionAction = new fromActions.CreateTransaction;
          const createTransactionSuccessAction = new fromActions.CreateTransactionSuccess(null);
          const openSnackBarSpy = spyOn(snackBarSpy, 'open');

          actions$ = hot('5ms a', { a: createTransactionAction });
          transactionsHttpServiceSpy.createTransaction.and.returnValue(
            cold('1s k|', { k: null })
          );

          const expected$ = '5ms 1s z';

          expectObservable(transactionsEffects.createTransaction$).toBe(expected$, {
            z: createTransactionSuccessAction
          });
        });
      });
    });

    describe('When fetch failure', () => {
      it('should return CreateTransactionFailure action', () => {
        scheduler.run(({ hot, cold, expectObservable }) => {
          const createTransactionAction = new fromActions.CreateTransaction;
          const error = new Error('something went wrong...');
          const createTransactionFailureAction = new fromActions.CreateTransactionFailure(error);

          actions$ = hot('5ms a', { a: createTransactionAction });
          transactionsHttpServiceSpy.createTransaction.and.returnValue(cold('1s #', null, error));

          const expected$ = '5ms 1s z';

          expectObservable(transactionsEffects.createTransaction$).toBe(expected$, {
            z: createTransactionFailureAction
          });
        });
      });
    });
  });

  describe('deleteTransaction$', () => {
    describe('When fetch success', () => {
      it('should return DeleteTransaction action', () => {
        scheduler.run(({ hot, cold, expectObservable }) => {
          const deleteTransactionAction = new fromActions.DeleteTransaction;
          const deleteTransactionSuccessAction = new fromActions.DeleteTransactionSuccess(null);
          const openSnackBarSpy = spyOn(snackBarSpy, 'open');

          actions$ = hot('5ms a', { a: deleteTransactionAction });
          transactionsHttpServiceSpy.deleteTransaction.and.returnValue(
            cold('1s k|', { k: null })
          );

          const expected$ = '5ms 1s z';

          expectObservable(transactionsEffects.deleteTransaction$).toBe(expected$, {
            z: deleteTransactionSuccessAction
          });
        });
      });
    });

    describe('When fetch failure', () => {
      it('should return DeleteTransactionFailure action', () => {
        scheduler.run(({ hot, cold, expectObservable }) => {
          const deleteTransactionAction = new fromActions.DeleteTransaction;
          const error = new Error('something went wrong...');
          const deleteTransactionFailureAction = new fromActions.DeleteTransactionFailure(error);

          actions$ = hot('5ms a', { a: deleteTransactionAction });
          transactionsHttpServiceSpy.deleteTransaction.and.returnValue(cold('1s #', null, error));

          const expected$ = '5ms 1s z';

          expectObservable(transactionsEffects.deleteTransaction$).toBe(expected$, {
            z: deleteTransactionFailureAction
          });
        });
      });
    });
  });

  describe('readTransactions$', () => {
    describe('When fetch success', () => {
      it('should return ReadTransactions action', () => {
        scheduler.run(({ hot, cold, expectObservable }) => {
          const readTransactionsAction = new fromActions.ReadTransactions;
          const readTransactionsSuccessAction = new fromActions.ReadTransactionsSuccess(null);

          actions$ = hot('5ms a', { a: readTransactionsAction });
          transactionsHttpServiceSpy.readTransactions.and.returnValue(
            cold('1s k|', { k: null })
          );

          const expected$ = '305ms 1s z';

          expectObservable(transactionsEffects.readTransactions$).toBe(expected$, {
            z: readTransactionsSuccessAction
          });
        });
      });
    });

    describe('When fetch failure', () => {
      it('should return ReadTransactionFailure action', () => {
        scheduler.run(({ hot, cold, expectObservable }) => {
          const readTransactionsAction = new fromActions.ReadTransactions;
          const error = new Error('something went wrong...');
          const readTransactionsFailureAction = new fromActions.ReadTransactionsFailure(error);

          actions$ = hot('5ms a', { a: readTransactionsAction });
          transactionsHttpServiceSpy.readTransactions.and.returnValue(cold('1s #', null, error));

          const expected$ = '5ms 1s z';

          expectObservable(transactionsEffects.readTransactions$).toBe(expected$, {
            z: readTransactionsFailureAction
          });
        });
      });
    });
  });

  describe('updateTransaction$', () => {
    describe('When fetch success', () => {
      it('should return ReadTransaction action', () => {
        scheduler.run(({ hot, cold, expectObservable }) => {
          const updateTransactionAction = new fromActions.UpdateTransaction;
          const updateTransactionSuccessAction = new fromActions.UpdateTransactionSuccess(null);
          const openSnackBarSpy = spyOn(snackBarSpy, 'open');

          actions$ = hot('5ms a', { a: updateTransactionAction });
          transactionsHttpServiceSpy.updateTransaction.and.returnValue(
            cold('1s k|', { k: null })
          );

          const expected$ = '5ms 1s z';

          expectObservable(transactionsEffects.updateTransaction$).toBe(expected$, {
            z: updateTransactionSuccessAction
          });
        });
      });
    });

    describe('When fetch failure', () => {
      it('should return ReadTransactionFailure action', () => {
        scheduler.run(({ hot, cold, expectObservable }) => {
          const updateTransactionAction = new fromActions.UpdateTransaction;
          const error = new Error('something went wrong...');
          const updateTransactionFailureAction = new fromActions.UpdateTransactionFailure(error);
          const openSnackBarSpy = spyOn(snackBarSpy, 'open');

          actions$ = hot('5ms a', { a: updateTransactionAction });
          transactionsHttpServiceSpy.updateTransaction.and.returnValue(cold('1s #', null, error));

          const expected$ = '5ms 1s z';

          expectObservable(transactionsEffects.updateTransaction$).toBe(expected$, {
            z: updateTransactionFailureAction
          });
        });
      });
    });
  });

});
