export interface FinanceCommonEntry {
  label: string;
  total: number;
  entries: FinanceCommonEntryEntry[];
}

export interface FinanceCommonEntryEntry {
  isInTotal: boolean;
  label: string;
  value: number;
}

export interface FinanceEntry {
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
