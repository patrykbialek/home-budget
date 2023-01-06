export interface DataEntry {
  key: string;
  entries: DataEntryEntries;
  label: string;
  order: number;
}

export interface DataEntryEntries {
  execution: DataEntryPlan;
  project: DataEntryPlan;
  key: string;
  label: string;
  order: number;
}

export interface DataEntryPlan {
  entries: {
    expenses: DataEntryPlanEntry;
    incomes: DataEntryPlanEntry;
  };
  label: string;
  path: string;
}

export interface DataEntryPlanEntry {
  isInTotal: boolean;
  label: string;
  notes: string;
  path: string;
  total: number;
  entries?: {
    [key: string]: DataEntryPlanEntry;
  };
}

export interface UpadatePayload {
  entry: string;
  path: string;
  total: number;
  notes?: string;
  order?: number;
}
