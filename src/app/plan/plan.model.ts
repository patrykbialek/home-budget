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

export interface PlanProject {
  expenses: number;
  incomes: number;
  increase: number;
  month: string;
  monthId: string;
  rest: number;
  path?: string;
  incomesPath: string;
  expensesPath: string;
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

export interface Plan {
  [key: string]: PlanTypee;
}

export interface PlanTypee {
  project: PlanMonth;
}

export interface PlanMonth {
  label: string;
  total: number;
  entries: PlanMonthEntry[];
}

export interface PlanMonthEntry {
  incomes: PlanMonthEntryIncomes;
  expenses: PlanMonthEntryExpenses;
}

export interface PlanMonthEntryExpenses {}

export interface PlanMonthEntryIncomes {
  label: string;
  total: number;
  entries: PlanMonthEntryIncomesEntry[];
}

export interface PlanMonthEntryIncomesEntry {
  patryk: PlanCommonEntry;
  gosia: PlanCommonEntry;
  other: PlanCommonEntry;
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
