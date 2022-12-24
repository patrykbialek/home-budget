import { UrlSegment } from '@angular/router';

export interface PlanGraphConfig {
  backgroundColor: string;
  borderColor: string;
  data: number[];
  label: string;
  pointBackgroundColor: string;
  pointBorderColor: string;
  pointHoverRadius: number;
  pointRadius: number;
  pointStyle: string;
}

export interface ChartOption {
  color: ChartOptionColor;
}

export interface ChartOptionColor {
  blue: string;
  green: string;
  red: string;
  transparent: string;
}

export interface MonthLabel {
  january: Item;
  february: Item;
  march: Item;
  april: Item;
  may: Item;
  june: Item;
  july: Item;
  august: Item;
  september: Item;
  october: Item;
  november: Item;
  december: Item;
}

export interface Item {
  id: string;
  long: string;
  short?: string;
}

export interface PlanProjectGraphData {
  expenses: Array<number>;
  incomes: Array<number>;
  increase: Array<number>;
}

export interface NavLink {
  href: string;
  index: number;
  label: string;
}

export interface GoToDetails {
  type: string;
  path?: string;
  month?: string;
}

export interface PlanType {
  [key: string]: Item;
}

export interface TransactionType {
  [key: string]: Item;
}

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

export interface DataLabels {
  [key: string]: string;
}

export interface DataLabel {
  key: string;
  value: string;
  order?: number;
}

export interface DataSourceSummary {
  expenses: number;
  incomes: number;
  increase: number;
  month: string;
  path: string;
  rest: number;
  order?: number;
}

export interface DataSourceDetails {
  month: string;
  total: number;
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
  order: number;
  path: string;
  notes: string;
  total: number;
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
  parentPath?: string;
  total?: number;
}

export interface UrlResponse {
  segments: UrlSegment;
}

export interface QueryParamsResponse {
  path: string;
  type: string;
}

export interface RouteParam {
  path: string;
  type: string;
}

export interface DataItem {
  entries: {
    [key: string]: any;
  };
  key: string;
  labl: string;
  order: number;
  value: any;
}


/////////

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
