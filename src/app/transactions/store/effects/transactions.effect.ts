import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { of, } from 'rxjs';
import { map, catchError, mergeMap, delay, tap, } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';
import * as fromActions from '../actions/transactions.actions';
import * as fromModels from '@transactions/models';
import * as fromServices from '../../services';

@Injectable()
export class TransactionsEffects {
  constructor(
    private actions$: Actions,
    private snackBar: MatSnackBar,
    private transactionsService: fromServices.TransactionsHttpService,
  ) { }

  @Effect()
  createTransaction$ = this.actions$.pipe(ofType(fromActions.CREATE_TRANSACTION),
    map((action: fromActions.CreateTransaction) => action.payload),
    mergeMap((payload: fromModels.TransactionPayload) => {
      return this.transactionsService
        .createTransaction(payload)
        .pipe(
          map(() => {
            this.openSnackBar('Dane zapisane.');
            return new fromActions.CreateTransactionSuccess();
          }),
          catchError((error) => {
            return of(new fromActions.CreateTransactionFailure(error));
          })
        );
    })
  );

  @Effect()
  deleteTransaction$ = this.actions$.pipe(ofType(
    fromActions.DELETE_TRANSACTION_FROM_DETAIL,
    fromActions.DELETE_TRANSACTION_FROM_LIST,
    ),
    map((action: fromActions.DeleteTransactionFromDetail | fromActions.DeleteTransactionFromList) => action.payload),
    mergeMap((payload: fromModels.TransactionPayload) => {
      return this.transactionsService
        .deleteTransaction(payload)
        .pipe(
          map(() => {
            this.openSnackBar('Transakcja usunięta.');
            return new fromActions.DeleteTransactionSuccess();
          }),
          catchError((error) => {
            return of(new fromActions.DeleteTransactionFailure(error));
          })
        );
    })
  );

  @Effect()
  readTransactions$ = this.actions$.pipe(
    ofType(fromActions.READ_TRANSACTIONS),
    map((action: fromActions.ReadTransactions) => action.payload),
    mergeMap((params: fromModels.TransactionParams) => {
      return this.transactionsService
        .readTransactions(params)
        .pipe(
          // NOTE: Give some time to see spinner
          delay(300),
          map((response: fromModels.Transaction[]) => {
            return new fromActions.ReadTransactionsSuccess(response);
          }),
          catchError((error) => {
            return of(new fromActions.ReadTransactionsFailure(error));
          })
        );
    })
  );

  @Effect()
  updateTransaction$ = this.actions$.pipe(ofType(fromActions.UPDATE_TRANSACTION),
    map((action: fromActions.UpdateTransaction) => action.payload),
    mergeMap((payload: fromModels.TransactionPayload) => {
      return this.transactionsService
        .updateTransaction(payload)
        .pipe(
          map(() => {
            this.openSnackBar('Dane zapisane.');
            return new fromActions.UpdateTransactionSuccess();
          }),
          catchError((error) => {
            return of(new fromActions.UpdateTransactionFailure(error));
          })
        );
    })
  );

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Zamknij', {
      duration: 5000,
    });
  }
}
