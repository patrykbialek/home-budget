export interface DataEntry {
  key: string;
  entries: DataEntryEntries;
  label: string;
  order: number;
}

export interface DataEntryEntries {
  execution: DataEntryBudget;
  project: DataEntryBudget;
  key: string;
  label: string;
  order: number;
}

export interface DataEntryBudget {
  entries: {
    expense: DataEntryBudgetEntry;
    income: DataEntryBudgetEntry;
  };
  label: string;
  path: string;
}

export interface DataEntryBudgetEntry {
  isInTotal: boolean;
  label: string;
  notes: string;
  path: string;
  total: number;
  entries?: {
    [key: string]: DataEntryBudgetEntry;
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

export interface BudgetConfig {
  type: string;
  year: string;
}
