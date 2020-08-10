import * as fromTransactions from './transactions.actions';

fdescribe('Transactions Actions', () => {

  describe('ReadTransactions Actions', () => {
    describe('ReadTransactions', () => {
      it('should create an action', () => {
        const params = {
          query: null,
          uid: null,
        };
        const action = new fromTransactions.ReadTransactions(params);

        expect({ ...action }).toEqual({
          type: fromTransactions.READ_TRANSACTIONS,
          payload: params,
        });
      });
    });

    describe('ReadTransactionsSuccess', () => {
      it('should create an action', () => {
        const payload = [];
        const action = new fromTransactions.ReadTransactionsSuccess([]);

        expect({ ...action }).toEqual({
          type: fromTransactions.READ_TRANSACTIONS_SUCCESS,
          payload,
        });
      });
    });

    describe('ReadTransactionsFailure', () => {
      it('should create an action', () => {
        const payload = { uid: 'test' };
        const action = new fromTransactions.ReadTransactionsFailure(payload);

        expect({ ...action }).toEqual({
          type: fromTransactions.READ_TRANSACTIONS_FAILURE,
          payload,
        });
      });
    });
  });

  describe('CreateTransactSion Actions', () => {
    describe('CreateTransaction', () => {
      it('should create an action', () => {
        const payload = {
          key: 'string',
          value: {
            account: null,
            amount: null,
            category: null,
            date: null,
            inBugdet: null,
            key: null,
            recipient: null,
            type: null,

            notes: 'string',
          },
          uid: 'string',
        };
        const action = new fromTransactions.CreateTransaction(payload);

        expect({ ...action }).toEqual({
          type: fromTransactions.CREATE_TRANSACTION,
          payload,
        });
      });
    });

    describe('CreateTransactionSuccess', () => {
      it('should create an action', () => {
        const action = new fromTransactions.CreateTransactionSuccess();

        expect({ ...action }).toEqual({
          type: fromTransactions.CREATE_TRANSACTION_SUCCESS,
        });
      });
    });

    describe('CreateTransactionFailure', () => {
      it('should create an action', () => {
        const payload = { uid: 'test' };
        const action = new fromTransactions.CreateTransactionFailure(payload);

        expect({ ...action }).toEqual({
          type: fromTransactions.CREATE_TRANSACTION_FAILURE,
          payload,
        });
      });
    });
  });

  describe('CreateTransaction Actions', () => {
    describe('CreateTransaction', () => {
      it('should create an action', () => {
        const payload = {
          key: 'string',
          value: {
            account: null,
            amount: null,
            category: null,
            date: null,
            inBugdet: null,
            key: null,
            recipient: null,
            type: null,

            notes: 'string',
          },
          uid: 'string',
        };
        const action = new fromTransactions.CreateTransaction(payload);

        expect({ ...action }).toEqual({
          type: fromTransactions.CREATE_TRANSACTION,
          payload,
        });
      });
    });

    describe('CreateTransactionSuccess', () => {
      it('should create an action', () => {
        const action = new fromTransactions.CreateTransactionSuccess();

        expect({ ...action }).toEqual({
          type: fromTransactions.CREATE_TRANSACTION_SUCCESS,
        });
      });
    });

    describe('CreateTransactionFailure', () => {
      it('should create an action', () => {
        const payload = { uid: 'test' };
        const action = new fromTransactions.CreateTransactionFailure(payload);

        expect({ ...action }).toEqual({
          type: fromTransactions.CREATE_TRANSACTION_FAILURE,
          payload,
        });
      });
    });
  });

  describe('DeleteTransaction Actions', () => {
    describe('DeleteTransaction', () => {
      it('should create an action', () => {
        const payload = {
          key: 'string',
          value: {
            account: null,
            amount: null,
            category: null,
            date: null,
            inBugdet: null,
            key: null,
            recipient: null,
            type: null,

            notes: 'string',
          },
          uid: 'string',
        };
        const action = new fromTransactions.DeleteTransactionFromDetail(payload);

        expect({ ...action }).toEqual({
          type: fromTransactions.DELETE_TRANSACTION_FROM_DETAIL,
          payload,
        });
      });
    });

    describe('DeleteTransactionSuccess', () => {
      it('should create an action', () => {
        const action = new fromTransactions.DeleteTransactionSuccess();

        expect({ ...action }).toEqual({
          type: fromTransactions.DELETE_TRANSACTION_SUCCESS,
        });
      });
    });

    describe('DeleteTransactionFailure', () => {
      it('should create an action', () => {
        const payload = { uid: 'test' };
        const action = new fromTransactions.DeleteTransactionFailure(payload);

        expect({ ...action }).toEqual({
          type: fromTransactions.DELETE_TRANSACTION_FAILURE,
          payload,
        });
      });
    });
  });

  describe('UpdateTransaction Actions', () => {
    describe('UpdateTransaction', () => {
      it('should create an action', () => {
        const payload = {
          key: 'string',
          value: null,
          uid: 'string',
        };
        const action = new fromTransactions.UpdateTransaction(payload);

        expect({ ...action }).toEqual({
          type: fromTransactions.UPDATE_TRANSACTION,
          payload,
        });
      });
    });

    describe('UpdateTransactionSuccess', () => {
      it('should create an action', () => {
        const payload = { uid: 'test' };
        const action = new fromTransactions.UpdateTransactionSuccess();

        expect({ ...action }).toEqual({
          type: fromTransactions.UPDATE_TRANSACTION_SUCCESS,
        });
      });
    });

    describe('UpdateTransactionFailure', () => {
      it('should create an action', () => {
        const payload = { uid: 'test' };
        const action = new fromTransactions.UpdateTransactionFailure(payload);

        expect({ ...action }).toEqual({
          type: fromTransactions.UPDATE_TRANSACTION_FAILURE,
          payload,
        });
      });
    });
  });

});
