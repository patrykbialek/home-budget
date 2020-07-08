import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromAuthentication from '../reducers/authentication.reducer';

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
