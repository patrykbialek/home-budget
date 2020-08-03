import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { of, } from 'rxjs';
import { map, catchError, mergeMap, } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

import * as fromActions from '../actions';
import * as fromModels from '../../models';
import * as fromServices from '../../services';

@Injectable()
export class AuthenticationEffects {

  constructor(
    private actions$: Actions,
    private snackBar: MatSnackBar,
    private authenticationService: fromServices.AuthenticationHttpService,
  ) { }

  @Effect()
  getUser$ = this.actions$.pipe(ofType(fromActions.GET_USER),
    map((action: fromActions.GetUser) => action.payload),
    mergeMap((payload: any) => {
      return this.authenticationService
        .getUser(payload)
        .pipe(
          map((response: any) => {
            return new fromActions.GetUserSuccess(response);
          }),
          catchError((error) => {
            return of(new fromActions.GetUserFailure(error));
          })
        );
    })
  );

  @Effect()
  loginUser$ = this.actions$.pipe(ofType(fromActions.LOGIN_USER),
    map((action: fromActions.LoginUser) => action.payload),
    mergeMap((payload: any) => {
      return this.authenticationService
        .loginUser(payload)
        .pipe(
          map((response: any) => {
            return new fromActions.LoginUserSuccess(response);
          }),
          catchError((error) => {
            const errorMessage = fromModels.ApiErrors.Parse(error.code);
            this.openSnackBar(errorMessage, 7000);
            return of(new fromActions.LoginUserFailure(error));
          })
        );
    })
  );

  @Effect()
  logoutUser$ = this.actions$.pipe(ofType(fromActions.LOGOUT_USER),
    mergeMap(() => {
      return this.authenticationService
        .logoutUser()
        .pipe(
          map((response: any) => {
            return new fromActions.LogoutUserSuccess(response);
          }),
          catchError((error) => {
            return of(new fromActions.LogoutUserFailure(error));
          })
        );
    })
  );

  @Effect()
  registerUser$ = this.actions$.pipe(ofType(fromActions.REGISTER_USER),
    map((action: fromActions.RegisterUser) => action.payload),
    mergeMap((payload: fromModels.UserPayload) => {
      return this.authenticationService
        .registerUser(payload)
        .pipe(
          map((response: any) => {
            this.openSnackBar('Dane zapisane.');
            return new fromActions.RegisterUserSuccess(response);
          }),
          catchError((error) => {
            const errorMessage = fromModels.ApiErrors.Parse(error.code);
            this.openSnackBar(errorMessage, 10000);
            return of(new fromActions.RegisterUserFailure(error));
          })
        );
    })
  );

  @Effect()
  resetPassword$ = this.actions$.pipe(ofType(fromActions.RESET_PASSWORD),
    map((action: fromActions.ResetPassword) => action.payload),
    mergeMap((payload: fromModels.UserPayload) => {
      return this.authenticationService
        .resetPassword(payload)
        .pipe(
          map((response: any) => {
            this.openSnackBar('Prośba o reset wysłana. Odbierz e-mail.', 10000);
            return new fromActions.ResetPasswordSuccess(response);
          }),
          catchError((error) => {
            const errorMessage = fromModels.ApiErrors.Parse(error.code);
            this.openSnackBar(errorMessage, 10000);
            return of(new fromActions.ResetPasswordFailure(error));
          })
        );
    })
  );

  @Effect()
  setPassword$ = this.actions$.pipe(ofType(fromActions.SET_PASSWORD),
    map((action: fromActions.SetPassword) => action.payload),
    mergeMap((payload: fromModels.UserPayload) => {
      return this.authenticationService
        .setPassword(payload)
        .pipe(
          map((response: any) => {
            this.openSnackBar('Hasło ustawione poprawnie.', 7000);
            return new fromActions.SetPasswordSuccess(response);
          }),
          catchError((error) => {
            const errorMessage = fromModels.ApiErrors.Parse(error.code);
            this.openSnackBar(errorMessage, 10000);
            return of(new fromActions.SetPasswordFailure(error));
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
