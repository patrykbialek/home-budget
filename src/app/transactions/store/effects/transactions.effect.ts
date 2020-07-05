import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { of, } from 'rxjs';
import { map, catchError, mergeMap, } from 'rxjs/operators';

import * as fromActions from '../actions/transactions.actions';
import * as fromServices from '../../services';

@Injectable()
export class TransactionsEffects {

  constructor(
    private actions$: Actions,
    private transactionsService: fromServices.TransactionsHttpService,
  ) { }

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
}
