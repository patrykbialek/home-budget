export interface DataEntry {
  key: string;
  entries: DataEntryEntries;
  label: string;
  order: number;
}

export interface DataEntryEntries {
  execution: DataEntryFinance;
  project: DataEntryFinance;
  key: string;
  label: string;
  order: number;
}

export interface DataEntryFinance {
  entries: {
    expense: DataEntryFinanceEntry;
    income: DataEntryFinanceEntry;
  };
  label: string;
  path: string;
}

export interface DataEntryFinanceEntry {
  isInTotal: boolean;
  label: string;
  notes: string;
  path: string;
  total: number;
  entries?: {
    [key: string]: DataEntryFinanceEntry;
  };
}

export interface UpdatePayload {
  entry: string;
  path: string;
  total?: number;
  isInTotal?: boolean;
  label?: string;
  notes?: string;
  order?: number;
}

export interface FinanceConfig {
  type: string;
  year: string;
}
