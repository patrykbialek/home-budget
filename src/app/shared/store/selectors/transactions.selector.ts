import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromTransactions from '../reducers/transactions.reducer';

export const getTransactionsState = createSelector(
  fromFeature.getMainState,
  (state: fromFeature.MainState) => state.transactions
);

export const getTransactions = createSelector(
  getTransactionsState,
  fromTransactions.getTransactions,
);

