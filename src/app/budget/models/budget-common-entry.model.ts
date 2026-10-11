export interface BudgetCommonEntry {
  label: string;
  total: number;
  entries: BudgetCommonEntryEntry[];
}

export interface BudgetCommonEntryEntry {
  isInTotal: boolean;
  label: string;
  value: number;
}

export interface BudgetEntry {
  entry: string;
  path: string | null;
  hasEntries?: boolean;
  href?: string;
  isCurrent?: boolean;
  isInTotal?: boolean;
  label?: string;
  month?: string;
  notes?: string;
  order?: number;
  parentPath?: string;
  total?: number;
}
