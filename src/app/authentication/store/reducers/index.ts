import { ActionReducer, ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromAuthentication from './authentication.reducer';

export interface MainState {
  user: fromAuthentication.AuthenticationState;
}

export const reducers: ActionReducerMap<MainState> = {
  user: fromAuthentication.reducer as ActionReducer<fromAuthentication.AuthenticationState>,
};

export const getMainState = createFeatureSelector<MainState>(
  'authentication'
);
