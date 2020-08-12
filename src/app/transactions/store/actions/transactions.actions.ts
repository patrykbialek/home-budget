import * as fromModels from '@home-budget/transactions/models';
import { Action } from '@ngrx/store';

// Read
export const READ_TRANSACTIONS          = '[Transaction List Page] Read transactions';
export const READ_TRANSACTIONS_SUCCESS  = '[Transactions API] Read transactions success';
export const READ_TRANSACTIONS_FAILURE  = '[Transactions API] Read transactions failure';

export class ReadTransactions implements Action {
  readonly type = READ_TRANSACTIONS;
  constructor(public payload: fromModels.TransactionParams, ) { }
}

export class ReadTransactionsSuccess implements Action {
  readonly type = READ_TRANSACTIONS_SUCCESS;
  constructor(public payload: fromModels.Transaction[], ) { }
}

export class ReadTransactionsFailure implements Action {
  readonly type = READ_TRANSACTIONS_FAILURE;
  constructor(public payload: any, ) { }
}

// Create
export const CREATE_TRANSACTION          = '[Transaction Detail Page] Create transaction';
export const CREATE_TRANSACTION_SUCCESS  = '[Transactions API] Create transaction success';
export const CREATE_TRANSACTION_FAILURE  = '[Transactions API] Create transaction failure';

export class CreateTransaction implements Action {
  readonly type = CREATE_TRANSACTION;
  constructor(public payload: fromModels.TransactionPayload, ) { }
}

export class CreateTransactionSuccess implements Action {
  readonly type = CREATE_TRANSACTION_SUCCESS;
}

export class CreateTransactionFailure implements Action {
  readonly type = CREATE_TRANSACTION_FAILURE;
  constructor(public payload: any, ) { }
}

// Delete
export const DELETE_TRANSACTION_FROM_DETAIL  = '[Transaction Detail Page] Delete transaction';
export const DELETE_TRANSACTION_FROM_LIST    = '[Transaction List Page] Delete transaction';
export const DELETE_TRANSACTION_SUCCESS      = '[Transactions API] Delete transaction success';
export const DELETE_TRANSACTION_FAILURE      = '[Transactions API] Delete transaction failure';

export class DeleteTransactionFromDetail implements Action {
  readonly type = DELETE_TRANSACTION_FROM_DETAIL;
  constructor(public payload: fromModels.TransactionPayload, ) { }
}

export class DeleteTransactionFromList implements Action {
  readonly type = DELETE_TRANSACTION_FROM_LIST;
  constructor(public payload: fromModels.TransactionPayload, ) { }
}

export class DeleteTransactionSuccess implements Action {
  readonly type = DELETE_TRANSACTION_SUCCESS;
}

export class DeleteTransactionFailure implements Action {
  readonly type = DELETE_TRANSACTION_FAILURE;
  constructor(public payload: any, ) { }
}

// Update
export const UPDATE_TRANSACTION          = '[Transaction Detail Page] Update transaction';
export const UPDATE_TRANSACTION_SUCCESS  = '[Transactions API] Update transaction success';
export const UPDATE_TRANSACTION_FAILURE  = '[Transactions API] Update transaction failure';

export class UpdateTransaction implements Action {
  readonly type = UPDATE_TRANSACTION;
  constructor(public payload: fromModels.TransactionPayload, ) { }
}

export class UpdateTransactionSuccess implements Action {
  readonly type = UPDATE_TRANSACTION_SUCCESS;
}

export class UpdateTransactionFailure implements Action {
  readonly type = UPDATE_TRANSACTION_FAILURE;
  constructor(public payload: any, ) { }
}

export type TransactionsAction =
  | ReadTransactions
  | ReadTransactionsSuccess
  | ReadTransactionsFailure
  | CreateTransaction
  | CreateTransactionSuccess
  | CreateTransactionFailure
  | DeleteTransactionFromDetail
  | DeleteTransactionFromList
  | DeleteTransactionSuccess
  | DeleteTransactionFailure
  | UpdateTransaction
  | UpdateTransactionSuccess
  | UpdateTransactionFailure

  ;
