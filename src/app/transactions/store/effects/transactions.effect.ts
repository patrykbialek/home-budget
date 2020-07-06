import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { of, } from 'rxjs';
import { map, catchError, mergeMap, } from 'rxjs/operators';

import * as fromActions from '../actions/transactions.actions';
import * as fromServices from '../../services';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    mergeMap((payload: any) => {
      return this.transactionsService
        .createTransaction(payload)
        .pipe(
          map((response: any) => {
            this.openSnackBar('Dane zapisane.');
            return new fromActions.CreateTransactionSuccess(response);
          }),
          catchError((error) => {
            return of(new fromActions.CreateTransactionFailure(error));
          })
        );
    })
  );

  @Effect()
  deleteTransaction$ = this.actions$.pipe(ofType(fromActions.DELETE_TRANSACTION),
    map((action: fromActions.DeleteTransaction) => action.payload),
    mergeMap((payload: any) => {
      return this.transactionsService
        .deleteTransaction(payload)
        .pipe(
          map((response: any) => {
            this.openSnackBar('Transakcja usunięta.');
            return new fromActions.DeleteTransactionSuccess(response);
          }),
          catchError((error) => {
            return of(new fromActions.DeleteTransactionFailure(error));
          })
        );
    })
  );

  @Effect()
  readTransactions$ = this.actions$.pipe(ofType(fromActions.READ_TRANSACTIONS),
    map((action: fromActions.ReadTransactions) => action.payload),
    mergeMap((query: any) => {
      return this.transactionsService
        .readTransactions(query)
        .pipe(
          map((response: any) => {
            return new fromActions.ReadTransactionsSuccess(response);
          }),
          catchError((error) => {
            return of(new fromActions.ReadTransactionsFailure(error));
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
