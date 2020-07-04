import * as fromTransactions from '../actions/transactions.actions';

export interface TransactionsState {
  entities: any[];
  isFailed: boolean;
  isLoading: boolean;
}

export const initialState: TransactionsState = {
  entities: null,
  isFailed: false,
  isLoading: false,
};

export function reducer(
  state = initialState,
  action: fromTransactions.TransactionsAction
): TransactionsState {

  switch (action.type) {

    case fromTransactions.READ_TRANSACTIONS: {
      return {
        ...state,
        entities: null,
        isFailed: false,
        isLoading: true,
      };
    }

    case fromTransactions.READ_TRANSACTIONS_SUCCESS: {
      const process = action.payload;

      return {
        ...state,
        entities: process,
        isFailed: false,
        isLoading: false,
      };
    }

    case fromTransactions.READ_TRANSACTIONS_FAILURE: {
      return {
        ...state,
        entities: null,
        isFailed: true,
        isLoading: false,
      };
    }

  }

  return state;
}

export const getIsFailed = (state: TransactionsState) => state.isFailed;
export const getIsLoading = (state: TransactionsState) => state.isLoading;
export const getTransactions = (state: TransactionsState) => state.entities;
