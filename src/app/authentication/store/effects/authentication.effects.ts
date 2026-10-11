import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { ApiErrors, ErrorMessage, PasswordReset, PasswordSet, User, UserLogin, UserRegister } from '@home-budget/authentication/models';
import { AuthenticationHttpService } from '@home-budget/authentication/services';
import * as fromActions from '@home-budget/authentication/store/actions';

@Injectable()
export class AuthenticationEffects {

  private readonly actions$ = inject(Actions);
  private readonly authenticationService = inject(AuthenticationHttpService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  loginUser$ = createEffect(() => this.actions$.pipe(ofType(fromActions.LOGIN_USER),
    map((action: fromActions.LoginUser) => action.payload),
    mergeMap((payload: UserLogin) => {
      return this.authenticationService
        .loginUser(payload)
        .pipe(
          map((response: User) => {
            return new fromActions.LoginUserSuccess(response);
          }),
          catchError((error: ErrorMessage) => {
            const errorMessage = ApiErrors.Parse(error.code);
            this.openSnackBar(errorMessage, 7000);
            return of(new fromActions.LoginUserFailure());
          })
        );
    })
  ));

  logoutUser$ = createEffect(() => this.actions$.pipe(
    ofType(
      fromActions.LOGOUT_USER_FROM_CONTAINER,
    ),
    mergeMap(() => {
      return this.authenticationService
        .logoutUser()
        .pipe(
          map(() => {
            this.router.navigate(['/login']);
            return new fromActions.LogoutUserSuccess();
          }),
          catchError((error: ErrorMessage) => {
            return of(new fromActions.LogoutUserFailure());
          })
        );
    })
  ));

  registerUser$ = createEffect(() => this.actions$.pipe(ofType(fromActions.REGISTER_USER),
    map((action: fromActions.RegisterUser) => action.payload),
    mergeMap((payload: UserRegister) => {
      return this.authenticationService
        .registerUser(payload)
        .pipe(
          map((response: User) => {
            this.openSnackBar('Dane zapisane.');
            return new fromActions.RegisterUserSuccess(response);
          }),
          catchError((error: ErrorMessage) => {
            const errorMessage = ApiErrors.Parse(error.code);
            this.openSnackBar(errorMessage, 10000);
            return of(new fromActions.RegisterUserFailure());
          })
        );
    })
  ));

  resetPassword$ = createEffect(() => this.actions$.pipe(ofType(fromActions.RESET_PASSWORD),
    map((action: fromActions.ResetPassword) => action.payload),
    mergeMap((payload: PasswordReset) => {
      return this.authenticationService
        .resetPassword(payload)
        .pipe(
          map(() => {
            this.openSnackBar('Prośba o reset wysłana. Odbierz e-mail.', 10000);
            return new fromActions.ResetPasswordSuccess();
          }),
          catchError((error: ErrorMessage) => {
            const errorMessage = ApiErrors.Parse(error.code);
            this.openSnackBar(errorMessage, 10000);
            return of(new fromActions.ResetPasswordFailure());
          })
        );
    })
  ));

  setPassword$ = createEffect(() => this.actions$.pipe(ofType(fromActions.SET_PASSWORD),
    map((action: fromActions.SetPassword) => action.payload),
    mergeMap((payload: PasswordSet) => {
      return this.authenticationService
        .setPassword(payload)
        .pipe(
          map(() => {
            this.openSnackBar('Hasło ustawione poprawnie.', 7000);
            return new fromActions.SetPasswordSuccess();
          }),
          catchError((error: ErrorMessage) => {
            const errorMessage = ApiErrors.Parse(error.code);
            this.openSnackBar(errorMessage, 10000);
            return of(new fromActions.SetPasswordFailure());
          })
        );
    })
  ));

  setUser$ = createEffect(() => this.actions$.pipe(ofType(fromActions.SET_USER),
    map((action: fromActions.SetUser) => action.payload),
    mergeMap((payload: User) => {
      return this.authenticationService
        .setUser(payload)
        .pipe(
          map((response: User) => {
            return new fromActions.SetUserSuccess(response);
          }),
          catchError((error: ErrorMessage) => {
            return of(new fromActions.SetUserFailure(error));
          })
        );
    })
  ));

  openSnackBar(message: string, duration = 5000) {
    this.snackBar.open(message, 'Zamknij', {
      duration,
    });
  }
}
