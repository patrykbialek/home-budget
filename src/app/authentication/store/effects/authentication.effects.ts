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