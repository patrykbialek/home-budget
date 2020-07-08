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
export class AuthenticationFacadeService {
  isFailed$: Observable<boolean>;
  isLoading$: Observable<boolean>;
  isSuccess$: Observable<boolean>;
  user$: Observable<any>;

  constructor(
    private store: Store<fromReducers.MainState>,
  ) {
    this.isSuccess$ = this.store.pipe(select(fromSelectors.getIsSuccess));
    this.user$ = this.store.pipe(select(fromSelectors.getUser));
  }

  registerUser(payload?: fromModels.UserPayload) {
    this.store.dispatch(new fromActions.RegisterUser(payload));
  }

}
