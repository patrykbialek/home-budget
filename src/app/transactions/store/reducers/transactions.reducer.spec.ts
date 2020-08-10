import * as fromTransactions from './transactions.reducer';
import * as fromActions from '../actions/transactions.actions';
import { Transaction } from '@transactions/models';

fdescribe('TransactionsReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromTransactions;
      const action = {} as any;
      const state = fromTransactions.reducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('CREATE_TRANSACTION action', () => {
    it('should set isLoading flag to true', () => {
      const { initialState } = fromTransactions;
      const action = new fromActions.CreateTransaction(null);
      const state = fromTransactions.reducer(initialState, action);

      expect(state.entities).toEqual([]);
      expect(state.isFailed).toEqual(false);
      expect(state.isLoading).toEqual(true);
    });
  });

  describe('READ_TRANSACTIONS action', () => {
    it('should set isLoading flag to true', () => {
      const { initialState } = fromTransactions;
      const action = new fromActions.ReadTransactions({
        query: null,
        uid: null,
      });
      const state = fromTransactions.reducer(initialState, action);

      expect(state.entities).toEqual([]);
      expect(state.isFailed).toEqual(false);
      expect(state.isLoading).toEqual(true);
    });
  });

  describe('READ_TRANSACTIONS_SUCCESS action', () => {
    it('should populate transaction collection', () => {
      const transactions: Transaction[] = [
        {
          account: null,
          amount: null,
          category: null,
          date: null,
          inBugdet: null,
          key: null,
          recipient: null,
          type: null,
        }
      ];
      const entities = transactions;
      const { initialState } = fromTransactions;
      const action = new fromActions.ReadTransactionsSuccess(transactions);
      const state = fromTransactions.reducer(initialState, action);

      expect(state.entities).toEqual(entities);
      expect(state.isFailed).toEqual(false);
      expect(state.isLoading).toEqual(false);
    });
  });

  describe('READ_TRANSACTIONS_FAILURE action', () => {
    it('should populate transactions collection as ampty collection', () => {
      const transactions: Transaction[] = [];
      const entities = transactions;
      const { initialState } = fromTransactions;
      const action = new fromActions.ReadTransactionsFailure(transactions);
      const state = fromTransactions.reducer(initialState, action);

      expect(state.entities).toEqual(entities);
      expect(state.isFailed).toEqual(true);
      expect(state.isLoading).toEqual(false);
    });
  });

  describe('CREATE_TRANSACTION_SUCCESS action', () => {
    it('should set isSuccess flag to true', () => {
      const { initialState } = fromTransactions;
      const action = new fromActions.CreateTransactionSuccess();
      const state = fromTransactions.reducer(initialState, action);

      expect(state.isFailed).toEqual(false);
      expect(state.isLoading).toEqual(false);
      expect(state.isSuccess).toEqual(true);
    });
  });

  describe('CREATE_TRANSACTION_FAILURE action', () => {
    it('should set isFailed flag to true', () => {
      const { initialState } = fromTransactions;
      const action = new fromActions.CreateTransactionFailure(null);
      const state = fromTransactions.reducer(initialState, action);

      expect(state.isFailed).toEqual(true);
      expect(state.isLoading).toEqual(false);
      expect(state.isSuccess).toEqual(false);
    });
  });

});

describe('TransactionsReducer Selectors', () => {
  describe('getIsFailed', () => {
    it('should return .isFailed', () => {
      const { initialState } = fromTransactions;
      const previousState = { ...initialState, isFailed: true };
      const slice = fromTransactions.getIsFailed(previousState);

      expect(slice).toEqual(true);
    });
  });

  describe('getIsLoading', () => {
    it('should return .isLoading', () => {
      const { initialState } = fromTransactions;
      const previousState = { ...initialState, isLoading: true };
      const slice = fromTransactions.getIsLoading(previousState);

      expect(slice).toEqual(true);
    });
  });

  describe('getIsSuccess', () => {
    it('should return .isSuccess', () => {
      const { initialState } = fromTransactions;
      const previousState = { ...initialState, isSuccess: true };
      const slice = fromTransactions.getIsSuccess(previousState);

      expect(slice).toEqual(true);
    });
  });

  describe('getUser', () => {
    it('should return .entity', () => {
      const transactions: Transaction[] = [
        {
          account: null,
          amount: null,
          category: null,
          date: null,
          inBugdet: null,
          key: null,
          recipient: null,
          type: null,
        }
      ];
      const entities = transactions;
      const { initialState } = fromTransactions;
      const previousState = { ...initialState, entities };
      const slice = fromTransactions.getTransactions(previousState);

      expect(slice).toEqual(entities);
    });
  });
});
