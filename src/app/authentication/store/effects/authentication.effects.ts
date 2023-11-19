import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as fromModels from '@home-budget/authentication/models';
import * as fromServices from '@home-budget/authentication/services';
import * as fromActions from '@home-budget/authentication/store/actions';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

@Injectable()
export class AuthenticationEffects {

  constructor(
    private actions$: Actions,
    private authenticationService: fromServices.AuthenticationHttpService,
    private snackBar: MatSnackBar,
  ) { }


  @Effect()
  loginUser$ = this.actions$.pipe(ofType(fromActions.LOGIN_USER),
    map((action: fromActions.LoginUser) => action.payload),
    mergeMap((payload: fromModels.UserLogin) => {
      return this.authenticationService
        .loginUser(payload)
        .pipe(
          map((response: fromModels.User) => {
            localStorage.setItem('uid', response.uid);
            return new fromActions.LoginUserSuccess(response);
          }),
          catchError((error: fromModels.ErrorMessage) => {
            const errorMessage = fromModels.ApiErrors.Parse(error.code);
            console.log(error)
            this.openSnackBar(errorMessage, 7000);
            return of(new fromActions.LoginUserFailure());
          })
        );
    })
  );

  @Effect()
  logoutUser$ = this.actions$.pipe(
    ofType(
      fromActions.LOGOUT_USER_FROM_CONTAINER,
    ),
    mergeMap(() => {
      return this.authenticationService
        .logoutUser()
        .pipe(
          map(() => {
            return new fromActions.LogoutUserSuccess();
          }),
          catchError((error: fromModels.ErrorMessage) => {
            return of(new fromActions.LogoutUserFailure());
          })
        );
    })
  );

  @Effect()
  registerUser$ = this.actions$.pipe(ofType(fromActions.REGISTER_USER),
    map((action: fromActions.RegisterUser) => action.payload),
    mergeMap((payload: fromModels.UserRegister) => {
      return this.authenticationService
        .registerUser(payload)
        .pipe(
          map((response: fromModels.User) => {
            this.openSnackBar('Dane zapisane.');
            return new fromActions.RegisterUserSuccess(response);
          }),
          catchError((error: fromModels.ErrorMessage) => {
            const errorMessage = fromModels.ApiErrors.Parse(error.code);
            this.openSnackBar(errorMessage, 10000);
            return of(new fromActions.RegisterUserFailure());
          })
        );
    })
  );

  @Effect()
  resetPassword$ = this.actions$.pipe(ofType(fromActions.RESET_PASSWORD),
    map((action: fromActions.ResetPassword) => action.payload),
    mergeMap((payload: fromModels.PasswordReset) => {
      return this.authenticationService
        .resetPassword(payload)
        .pipe(
          map(() => {
            this.openSnackBar('Prośba o reset wysłana. Odbierz e-mail.', 10000);
            return new fromActions.ResetPasswordSuccess();
          }),
          catchError((error: fromModels.ErrorMessage) => {
            const errorMessage = fromModels.ApiErrors.Parse(error.code);
            this.openSnackBar(errorMessage, 10000);
            return of(new fromActions.ResetPasswordFailure());
          })
        );
    })
  );

  @Effect()
  setPassword$ = this.actions$.pipe(ofType(fromActions.SET_PASSWORD),
    map((action: fromActions.SetPassword) => action.payload),
    mergeMap((payload: fromModels.PasswordSet) => {
      return this.authenticationService
        .setPassword(payload)
        .pipe(
          map(() => {
            this.openSnackBar('Hasło ustawione poprawnie.', 7000);
            return new fromActions.SetPasswordSuccess();
          }),
          catchError((error: fromModels.ErrorMessage) => {
            const errorMessage = fromModels.ApiErrors.Parse(error.code);
            this.openSnackBar(errorMessage, 10000);
            return of(new fromActions.SetPasswordFailure());
          })
        );
    })
  );

  @Effect()
  setUser$ = this.actions$.pipe(ofType(fromActions.SET_USER),
    map((action: fromActions.SetUser) => action.payload),
    mergeMap((payload: fromModels.User) => {
      return this.authenticationService
        .setUser(payload)
        .pipe(
          map((response: fromModels.User) => {
            return new fromActions.SetUserSuccess(response);
          }),
          catchError((error: fromModels.ErrorMessage) => {
            return of(new fromActions.SetUserFailure(error));
          })
        );
    })
  );

  openSnackBar(message: string, duration = 5000) {
    this.snackBar.open(message, 'Zamknij', {
      duration,
    });
  }
}
