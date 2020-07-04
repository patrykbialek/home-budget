import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Store, select, Action } from '@ngrx/store';

// import * as fromModels from '../../models';
import * as fromReducers from '../reducers';
import * as fromSelectors from '../selectors';

@Injectable({
  providedIn: 'root'
})
export class BoardsFacadeService {
  transactions$: Observable<any>;
  isFailed$: Observable<boolean>;
  isLoading$: Observable<boolean>;
  isSuccess$: Observable<boolean>;

  constructor(
    private store: Store<fromReducers.MainState>,
  ) {
    this.transactions$ = this.store.pipe(select(fromSelectors.getTransactions));
    // this.isFailed$ = this.store.pipe(select(fromSelectors.));
    // this.isLoading$ = this.store.pipe(select(fromSelectors.));
    // this.isSuccess$ = this.store.pipe(select(fromSelectors.));
  }

  dispatch(action: Action) {
    this.store.dispatch(action);
  }

}
