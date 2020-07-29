import { createSelector } from '@ngrx/store';

import * as fromRoot from '@shared/store';
import * as fromModels from '../../models';
import * as fromFeature from '../reducers';
import * as fromTransactions from '../reducers/transactions.reducer';

export const getTransactionsState = createSelector(
  fromFeature.getMainState,
  (state: fromFeature.MainState) => state.transactions
);

export const getIsLoading = createSelector(
  getTransactionsState,
  fromTransactions.getIsLoading,
);

export const getIsSuccess = createSelector(
  getTransactionsState,
  fromTransactions.getIsSuccess,
);

export const getSelectedTransaction = createSelector(
  getTransactionsState,
  fromRoot.getRouterState,
  (state, router): fromModels.Transaction => {
    const transaction = state.entities.find(entity => entity.key === router.state.params.key)
    return router.state && transaction;
  }
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

