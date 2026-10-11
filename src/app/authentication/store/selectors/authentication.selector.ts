import { createSelector } from '@ngrx/store';

import * as fromAuthentication from '@home-budget/authentication/store/reducers/authentication.reducer';
import { MainState, getMainState } from '@home-budget/authentication/store/reducers';

export const getAuthenticationState = createSelector(
  getMainState,
  (state: MainState) => state.user
);

export const getIsSuccess = createSelector(
  getAuthenticationState,
  fromAuthentication.getIsSuccess,
);

export const getUser = createSelector(
  getAuthenticationState,
  fromAuthentication.getUser,
);
