import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import * as fromActions from '@home-budget/authentication/store/actions';
import { getIsSuccess, getUser } from '@home-budget/authentication/store/selectors';
import { MainState } from '@home-budget/authentication/store/reducers';
import { PasswordReset, PasswordSet, User, UserLogin, UserRegister } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationFacadeService {

  private readonly store: Store<MainState> = inject(Store);

  readonly isSuccess$: Observable<boolean> = this.store.pipe(select(getIsSuccess));
  readonly user$: Observable<User | null> = this.store.pipe(select(getUser));

  setUser(payload: User) {
    this.store.dispatch(new fromActions.SetUser(payload));
  }

  loginUser(payload: UserLogin) {
    this.store.dispatch(new fromActions.LoginUser(payload));
  }

  logoutUserFromContainer() {
    this.store.dispatch(new fromActions.LogoutUserFromContainer());
  }

  registerUser(payload: UserRegister) {
    this.store.dispatch(new fromActions.RegisterUser(payload));
  }

  resetPassword(payload: PasswordReset) {
    this.store.dispatch(new fromActions.ResetPassword(payload));
  }

  setPassword(payload: PasswordSet) {
    this.store.dispatch(new fromActions.SetPassword(payload));
  }
}
