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

export type TransactionsAction =
  | ReadTransactions
  | ReadTransactionsSuccess
  | ReadTransactionsFailure

  ;
