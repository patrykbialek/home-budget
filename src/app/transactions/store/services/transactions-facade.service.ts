import { Injectable } from '@angular/core';
import * as fromModels from '@home-budget/transactions/models';
import * as fromActions from '@home-budget/transactions/store/actions';
import * as fromReducers from '@home-budget/transactions/store/reducers';
import * as fromSelectors from '@home-budget/transactions/store/selectors';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionsFacadeService {
  transaction$: Observable<fromModels.Transaction>;
  transactions$: Observable<any>;
  isFailed$: Observable<boolean>;
  isLoading$: Observable<boolean>;
  isSuccess$: Observable<boolean>;
  total$: Observable<any>;

  constructor(
    private store: Store<fromReducers.MainState>,
  ) {
    this.transaction$ = this.store.pipe(select(fromSelectors.getSelectedTransaction));
    this.transactions$ = this.store.pipe(select(fromSelectors.getTransactions));
    this.total$ = this.store.pipe(select(fromSelectors.getTotal));
    // this.isFailed$ = this.store.pipe(select(fromSelectors.));
    this.isLoading$ = this.store.pipe(select(fromSelectors.getIsLoading));
    this.isSuccess$ = this.store.pipe(select(fromSelectors.getIsSuccess));
  }

  createTransaction(payload: fromModels.TransactionPayload) {
    this.store.dispatch(new fromActions.CreateTransaction(payload));
  }

  deleteTransactionFromDetail(payload: fromModels.TransactionPayload) {
    this.store.dispatch(new fromActions.DeleteTransactionFromDetail(payload));
  }

  deleteTransactionFromList(payload: fromModels.TransactionPayload) {
    this.store.dispatch(new fromActions.DeleteTransactionFromList(payload));
  }

  readTransactions(params: fromModels.TransactionParams) {
    this.store.dispatch(new fromActions.ReadTransactions(params));
  }

  updateTransaction(payload: fromModels.TransactionPayload) {
    this.store.dispatch(new fromActions.UpdateTransaction(payload));
  }

}
