import * as fromTransactions from '../actions/transactions.actions';

export interface TransactionsState {
  entities: any[];
  isFailed: boolean;
  isLoading: boolean;
  isSuccess: boolean;
}

export const initialState: TransactionsState = {
  entities: [],
  isFailed: false,
  isLoading: false,
  isSuccess: false,
};

export function reducer(
  state = initialState,
  action: fromTransactions.TransactionsAction
): TransactionsState {

  switch (action.type) {

    case fromTransactions.READ_TRANSACTIONS: {
      return {
        ...state,
        entities: [],
        isFailed: false,
        isLoading: true,
        isSuccess: false,
      };
    }

    case fromTransactions.READ_TRANSACTIONS_SUCCESS: {
      const transactions = action.payload;

      return {
        ...state,
        entities: transactions,
        isFailed: false,
        isLoading: false,
        isSuccess: true,
      };
    }

    case fromTransactions.READ_TRANSACTIONS_FAILURE: {
      return {
        ...state,
        entities: [],
        isFailed: true,
        isLoading: false,
      };
    }

    case fromTransactions.CREATE_TRANSACTION_SUCCESS:
    case fromTransactions.UPDATE_TRANSACTION_SUCCESS:
    case fromTransactions.DELETE_TRANSACTION_SUCCESS: {
      return {
        ...state,
        isFailed: false,
        isLoading: false,
        isSuccess: true,
      };
    }

    case fromTransactions.CREATE_TRANSACTION_FAILURE:
    case fromTransactions.DELETE_TRANSACTION_FAILURE:
    case fromTransactions.UPDATE_TRANSACTION_FAILURE: {
      return {
        ...state,
        isFailed: true,
        isLoading: false,
        isSuccess: false,
      };
    }

  }

  return state;
}

export const getIsFailed = (state: TransactionsState) => state.isFailed;
export const getIsLoading = (state: TransactionsState) => state.isLoading;
export const getIsSuccess = (state: TransactionsState) => state.isSuccess;
export const getTransactions = (state: TransactionsState) => state.entities;
