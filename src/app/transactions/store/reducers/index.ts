import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromTransactions from './transactions.reducer';

export interface MainState {
  transactions: fromTransactions.TransactionsState;
}

export const reducers: ActionReducerMap<MainState> = {
  transactions: fromTransactions.reducer,
};

export const getMainState = createFeatureSelector<MainState>(
  'transactions'
);
