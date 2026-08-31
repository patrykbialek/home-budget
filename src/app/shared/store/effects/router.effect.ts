import { Location } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import * as RouterActions from '@home-budget/shared/store/actions/router.actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class RouterEffects {
  private actions$ = inject(Actions);
  private router = inject(Router);
  private location = inject(Location);


  navigate$ = createEffect(() => this.actions$.pipe(ofType(RouterActions.GO),
    map((action: RouterActions.Go) => action.payload),
    tap(({ path, query: queryParams, extras }) => {
      this.router.navigate(path, { queryParams, ...extras });
    })
  ), { dispatch: false });


  navigateBack$ = createEffect(() => this.actions$
    .pipe(
      ofType(RouterActions.BACK),
      tap(() => this.location.back()),
    ), { dispatch: false });


  navigateForward$ = createEffect(() => this.actions$
    .pipe(
      ofType(RouterActions.FORWARD),
      tap(() => this.location.forward()),
    ), { dispatch: false });
}
