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
    const transaction = state.entities.find(entity => entity.key === router.state.params.key);
    return router.state && transaction;
  }
);

export const getTransactions = createSelector(
  getTransactionsState,
  state => {
    const transactions = state.entities.map(transaction => {
      transaction = {
        ...transaction,
        amount: transaction.type === 'expense'
          ? transaction.amount = -transaction.amount
          : transaction.amount = transaction.amount
      };

      return transaction;
    });

    return transactions;
  }
);

export const getTotal = createSelector(
  getTransactionsState,
  state => {
    const total = {
      all: 0.001,
      expense: -0.001,
      income: 0.001,
    };
    const transactions = state.entities;

    // All
    transactions.forEach(transaction => {
      total.all = transaction.type === 'income'
        ? total.all += transaction.amount
        : total.all -= transaction.amount;
    });

    // Expense
    transactions
      .filter(transaction => transaction.type === 'expense')
      .forEach(transaction => {
        total.expense -= transaction.amount;
      });

    // Income
    transactions
      .filter(transaction => transaction.type === 'income')
      .forEach(transaction => {
        total.income += transaction.amount;
      });

    return total;
  },
);
