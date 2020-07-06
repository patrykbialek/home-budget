import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Store, select, Action } from '@ngrx/store';

import * as fromActions from '../actions';
import * as fromReducers from '../reducers';
import * as fromSelectors from '../selectors';

@Injectable({
  providedIn: 'root'
})
export class TransactionsFacadeService {
  transactions$: Observable<any>;
  isFailed$: Observable<boolean>;
  isLoading$: Observable<boolean>;
  isSuccess$: Observable<boolean>;
  total$: Observable<number>;

  constructor(
    private store: Store<fromReducers.MainState>,
  ) {
    this.transactions$ = this.store.pipe(select(fromSelectors.getTransactions));
    this.total$ = this.store.pipe(select(fromSelectors.getTotal));
    // this.isFailed$ = this.store.pipe(select(fromSelectors.));
    // this.isLoading$ = this.store.pipe(select(fromSelectors.));
    this.isSuccess$ = this.store.pipe(select(fromSelectors.getIsSuccess));
  }

  createTransaction(payload?: any) {
    this.store.dispatch(new fromActions.CreateTransaction(payload));
  }

  readTransactions(query?: any) {
    this.store.dispatch(new fromActions.ReadTransactions(query));
  }

}
