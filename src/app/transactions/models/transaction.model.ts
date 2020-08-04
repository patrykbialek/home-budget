import { BudgetCategory, TransactionType } from './';

export interface Transaction {
  account: Account;
  amount: number;
  category: string;
  date: Date;
  inBugdet: boolean;
  key: string;
  recipient: string;
  type: TransactionType;

  notes?: string;
}
