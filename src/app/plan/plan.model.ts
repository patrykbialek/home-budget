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
  index: number;
  label: string;
  link: string;
}

export interface GoToDetails {
  monthId: string;
  transactionType: string;
}

export interface PlanType {
  [key: string]: Item;
}

export interface TransactionType {
  [key: string]: Item;
}
