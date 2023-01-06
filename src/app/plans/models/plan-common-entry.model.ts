export interface PlanCommonEntry {
  label: string;
  total: number;
  entries: PlanCommonEntryEntry[];
}

export interface PlanCommonEntryEntry {
  isInTotal: boolean;
  label: string;
  value: number;
}

export interface PlanEntry {
  entry: string;
  path: string;
  hasEntries?: boolean;
  href?: string;
  isCurrent?: boolean;
  label?: string;
  month?: string;
  notes?: string;
  order?: number;
  parentPath?: string;
  total?: number;
}
