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

export const getTotal = createSelector(
  getTransactionsState,
  state => {
    let total = 0;
    const transactions = state.entities;
    if (transactions) {
      transactions.forEach(transaction => {
        total = transaction.type === 'income' ? total += transaction.amount : total -= transaction.amount;
      });
    }

    return total;
  },
);

