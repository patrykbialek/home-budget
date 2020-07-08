import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { of, EMPTY, } from 'rxjs';
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
            return of(new fromActions.RegisterUserFailure(error));
          })
        );
    })
  );

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Zamknij', {
      duration: 5000,
    });
  }
}
