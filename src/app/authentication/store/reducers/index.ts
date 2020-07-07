import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromAuthentication from './authentication.reducer';

export interface MainState {
  user: fromAuthentication.AuthenticationState;
}

export const reducers: ActionReducerMap<MainState> = {
  user: fromAuthentication.reducer,
};

export const getMainState = createFeatureSelector<MainState>(
  'authentication'
);
