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
  rest: number;
}

export interface MonthLabel {
  january: MonthLabelContent;
  february: MonthLabelContent;
  march: MonthLabelContent;
  april: MonthLabelContent;
  may: MonthLabelContent;
  june: MonthLabelContent;
  july: MonthLabelContent;
  august: MonthLabelContent;
  september: MonthLabelContent;
  october: MonthLabelContent;
  november: MonthLabelContent;
  december: MonthLabelContent;
}

export interface MonthLabelContent {
  long: string;
  short: string;
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
