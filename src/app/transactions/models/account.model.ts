import { AccountType } from './';

export interface Account {
  key: string;
  name: string;
  type: AccountType;

  number?: string;
}
