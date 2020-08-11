import { createSelector } from '@ngrx/store';

import * as fromFeature from '@home-budget/authentication/store/reducers';
import * as fromAuthentication from '@home-budget/authentication/store/reducers/authentication.reducer';

export const getAuthenticationState = createSelector(
  fromFeature.getMainState,
  (state: fromFeature.MainState) => state.user
);

export const getIsSuccess = createSelector(
  getAuthenticationState,
  fromAuthentication.getIsSuccess,
);

export const getUser = createSelector(
  getAuthenticationState,
  fromAuthentication.getUser,
);
