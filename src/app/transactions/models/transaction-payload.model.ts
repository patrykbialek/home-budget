import { Transaction } from './';

export interface TransactionPayload {
  key: string;
  value: Transaction;
  uid?: string;
}
