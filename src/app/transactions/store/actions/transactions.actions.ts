import { Action } from '@ngrx/store';

// Read
export const READ_TRANSACTIONS          = '[Main] Read transactions';
export const READ_TRANSACTIONS_SUCCESS  = '[Main] Read transactions success';
export const READ_TRANSACTIONS_FAILURE  = '[Main] Read transactions failure';

export class ReadTransactions implements Action {
  readonly type = READ_TRANSACTIONS;
  constructor(public payload?: any, ) { }
}

export class ReadTransactionsSuccess implements Action {
  readonly type = READ_TRANSACTIONS_SUCCESS;
  constructor(public payload: any, ) { }
}

export class ReadTransactionsFailure implements Action {
  readonly type = READ_TRANSACTIONS_FAILURE;
  constructor(public payload: any, ) { }
}

// Create
export const CREATE_TRANSACTION          = '[Main] Create transaction';
export const CREATE_TRANSACTION_SUCCESS  = '[Main] Create transaction success';
export const CREATE_TRANSACTION_FAILURE  = '[Main] Create transaction failure';

export class CreateTransaction implements Action {
  readonly type = CREATE_TRANSACTION;
  constructor(public payload?: any, ) { }
}

export class CreateTransactionSuccess implements Action {
  readonly type = CREATE_TRANSACTION_SUCCESS;
  constructor(public payload: any, ) { }
}

export class CreateTransactionFailure implements Action {
  readonly type = CREATE_TRANSACTION_FAILURE;
  constructor(public payload: any, ) { }
}

// Delete
export const DELETE_TRANSACTION          = '[Main] Delete transaction';
export const DELETE_TRANSACTION_SUCCESS  = '[Main] Delete transaction success';
export const DELETE_TRANSACTION_FAILURE  = '[Main] Delete transaction failure';

export class DeleteTransaction implements Action {
  readonly type = DELETE_TRANSACTION;
  constructor(public payload?: any, ) { }
}

export class DeleteTransactionSuccess implements Action {
  readonly type = DELETE_TRANSACTION_SUCCESS;
  constructor(public payload: any, ) { }
}

export class DeleteTransactionFailure implements Action {
  readonly type = DELETE_TRANSACTION_FAILURE;
  constructor(public payload: any, ) { }
}

export type TransactionsAction =
  | ReadTransactions
  | ReadTransactionsSuccess
  | ReadTransactionsFailure
  | CreateTransaction
  | CreateTransactionSuccess
  | CreateTransactionFailure
  | DeleteTransaction
  | DeleteTransactionSuccess
  | DeleteTransactionFailure

  ;
