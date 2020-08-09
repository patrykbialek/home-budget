import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Store, select, Action } from '@ngrx/store';

import * as fromModels from '../../models';
import * as fromActions from '../actions';
import * as fromReducers from '../reducers';
import * as fromSelectors from '../selectors';
import { UserLogin } from '../../models';

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

  setUser(payload: fromModels.User) {
    this.store.dispatch(new fromActions.SetUser(payload));
  }

  loginUser(payload: UserLogin) {
    this.store.dispatch(new fromActions.LoginUser(payload));
  }

  logoutUserFromContainer() {
    this.store.dispatch(new fromActions.LogoutUserFromContainer());
  }

  registerUser(payload: fromModels.UserRegister) {
    this.store.dispatch(new fromActions.RegisterUser(payload));
  }

  resetPassword(payload: fromModels.PasswordReset) {
    this.store.dispatch(new fromActions.ResetPassword(payload));
  }

  setPassword(payload: fromModels.PasswordSet) {
    this.store.dispatch(new fromActions.SetPassword(payload));
  }

}
