import { Injectable, inject } from '@angular/core';
import * as fromActions from '@home-budget/authentication/store/actions';
import * as fromReducers from '@home-budget/authentication/store/reducers';
import * as fromSelectors from '@home-budget/authentication/store/selectors';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromModels from '../../models';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationFacadeService {

  private readonly store: Store<fromReducers.MainState> = inject(Store);

  readonly isSuccess$: Observable<boolean> = this.store.pipe(select(fromSelectors.getIsSuccess));
  readonly user$: Observable<fromModels.User | null> = this.store.pipe(select(fromSelectors.getUser));

  setUser(payload: fromModels.User) {
    this.store.dispatch(new fromActions.SetUser(payload));
  }

  loginUser(payload: fromModels.UserLogin) {
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
