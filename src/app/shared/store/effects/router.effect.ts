import { Injectable, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';

import { BACK, FORWARD, GO, Go } from '@home-budget/shared/store/actions/router.actions';

@Injectable()
export class RouterEffects {
  private actions$ = inject(Actions);
  private router = inject(Router);
  private location = inject(Location);

  navigate$ = createEffect(() => this.actions$.pipe(ofType(GO),
    map((action: Go) => action.payload),
    tap(({ path, query: queryParams, extras }) => {
      this.router.navigate(path, { queryParams, ...extras });
    })
  ), { dispatch: false });

  navigateBack$ = createEffect(() => this.actions$
    .pipe(
      ofType(BACK),
      tap(() => this.location.back()),
    ), { dispatch: false });

  navigateForward$ = createEffect(() => this.actions$
    .pipe(
      ofType(FORWARD),
      tap(() => this.location.forward()),
    ), { dispatch: false });
}
