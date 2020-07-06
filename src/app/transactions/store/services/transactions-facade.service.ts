import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Store, select, Action } from '@ngrx/store';

import * as fromModels from '../../models';
import * as fromActions from '../actions';
import * as fromReducers from '../reducers';
import * as fromSelectors from '../selectors';

@Injectable({
  providedIn: 'root'
})
export class TransactionsFacadeService {
  transaction$: Observable<fromModels.Transaction>;
  transactions$: Observable<any>;
  isFailed$: Observable<boolean>;
  isLoading$: Observable<boolean>;
  isSuccess$: Observable<boolean>;
  total$: Observable<number>;

  constructor(
    private store: Store<fromReducers.MainState>,
  ) {
    this.transaction$ = this.store.pipe(select(fromSelectors.getSelectedTransaction));
    this.transactions$ = this.store.pipe(select(fromSelectors.getTransactions));
    this.total$ = this.store.pipe(select(fromSelectors.getTotal));
    // this.isFailed$ = this.store.pipe(select(fromSelectors.));
    // this.isLoading$ = this.store.pipe(select(fromSelectors.));
    this.isSuccess$ = this.store.pipe(select(fromSelectors.getIsSuccess));
  }

  createTransaction(payload?: fromModels.TransactionPayload) {
    this.store.dispatch(new fromActions.CreateTransaction(payload));
  }

  deleteTransaction(payload?: fromModels.TransactionPayload) {
    this.store.dispatch(new fromActions.DeleteTransaction(payload));
  }

  readTransactions(query?: any) {
    this.store.dispatch(new fromActions.ReadTransactions(query));
  }

  updateTransaction(payload?: fromModels.TransactionPayload) {
    this.store.dispatch(new fromActions.UpdateTransaction(payload));
  }

}
