export interface DataSourceSummary {
  expense: number;
  income: number;
  increase: number;
  month: string;
  path: string;
  rest: number;
  order?: number;
}

export interface DataSourceDetails {
  month: string;
  total: number;
  isInTotal?: boolean;
  notes?: string;
  order?: number;
  parentPath?: string;
  path?: string;
}

export interface DataSourceDetailsEntry {
  entries: any;
  hasEntries: boolean;
  isInTotal: boolean;
  label: string;
  notes: string;
  order: number;
  path: string;
  total: number;
}
