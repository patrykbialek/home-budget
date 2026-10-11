import { createSelector } from '@ngrx/store';

import { MainState, getMainState } from '@home-budget/authentication/store/reducers';
import * as fromAuthentication from '@home-budget/authentication/store/reducers/authentication.reducer';

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
