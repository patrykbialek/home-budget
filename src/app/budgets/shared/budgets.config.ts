import * as fromModels from '@budgets/models';

export const chartOption: fromModels.ChartOption = {
  color: {
    blue: 'rgba(0, 132, 255, 1)',
    green: 'rgba(13, 157, 61, 1)',
    red: 'rgba(242, 38, 19, 1)',
    transparent: 'rgba(255, 255, 255, 0)',
  },
};

export const months: fromModels.DataLabel[] = [
  {
    key: 'jan',
    value: 'Styczeń',
  },
  {
    key: 'feb',
    value: 'Luty',
  },
  {
    key: 'mar',
    value: 'Marzec',
  },
  {
    key: 'apr',
    value: 'Kwiecień',
  },
  {
    key: 'may',
    value: 'Maj',
  },
  {
    key: 'jun',
    value: 'Czerwiec',
  },
  {
    key: 'jul',
    value: 'Lipiec',
  },
  {
    key: 'aug',
    value: 'Sierpień',
  },
  {
    key: 'sep',
    value: 'Wrzesień',
  },
  {
    key: 'oct',
    value: 'Październik',
  },
  {
    key: 'nov',
    value: 'Listopad',
  },
  {
    key: 'dec',
    value: 'Grudzień',
  },
];

export const monthLabel: fromModels.MonthLabel = {
  january: {
    id: 'jan',
    long: 'Styczeń',
    short: 'Sty',
  },
  february: {
    id: 'feb',
    long: 'Luty',
    short: 'Lut',
  },
  march: {
    id: 'mar',
    long: 'Marzec',
    short: 'Mar',
  },
  april: {
    id: 'apr',
    long: 'Kwiecień',
    short: 'Kwi',
  },
  may: {
    id: 'may',
    long: 'Maj',
    short: 'Maj',
  },
  june: {
    id: 'jun',
    long: 'Czerwiec',
    short: 'Cze',
  },
  july: {
    id: 'jul',
    long: 'Lipiec',
    short: 'LIp',
  },
  august: {
    id: 'aug',
    long: 'Sierpień',
    short: 'Sie',
  },
  september: {
    id: 'sep',
    long: 'Wrzesień',
    short: 'Wrz',
  },
  october: {
    id: 'oct',
    long: 'Październik',
    short: 'Paź',
  },
  november: {
    id: 'nov',
    long: 'Listopad',
    short: 'Lis',
  },
  december: {
    id: 'dec',
    long: 'Grudzień',
    short: 'Gru',
  },
};

export const labels: fromModels.DataLabel[] = [
  { key: 'execution', value: 'Wykonanie' },
  { key: 'expense', value: 'Wydatki' },
  { key: 'income', value: 'Przychody' },
  { key: 'month', value: 'Miesiąc' },
  { key: 'project', value: 'Projekt' },
  { key: 'total', value: 'Razem' },
];

export const planColumns: string[] = [
  'month', 'income', 'expense', 'rest', 'increase',
];

export const navLinks: fromModels.NavLink[] = [
  {
    label: 'Projekt',
    href: './project',
    index: 0,
  },
  {
    label: 'Wykonanie',
    href: './execution',
    index: 1,
  },
];

export const defaultDataSource: fromModels.DataSourceSummary[] = [
  { month: 'jan', expense: 0, income: 0, increase: 0, path: '', rest: 0 },
  { month: 'feb', expense: 0, income: 0, increase: 0, path: '', rest: 0 },
  { month: 'mar', expense: 0, income: 0, increase: 0, path: '', rest: 0 },
  { month: 'apr', expense: 0, income: 0, increase: 0, path: '', rest: 0 },
  { month: 'may', expense: 0, income: 0, increase: 0, path: '', rest: 0 },
  { month: 'jun', expense: 0, income: 0, increase: 0, path: '', rest: 0 },
  { month: 'jul', expense: 0, income: 0, increase: 0, path: '', rest: 0 },
  { month: 'aug', expense: 0, income: 0, increase: 0, path: '', rest: 0 },
  { month: 'sep', expense: 0, income: 0, increase: 0, path: '', rest: 0 },
  { month: 'oct', expense: 0, income: 0, increase: 0, path: '', rest: 0 },
  { month: 'nov', expense: 0, income: 0, increase: 0, path: '', rest: 0 },
  { month: 'dec', expense: 0, income: 0, increase: 0, path: '', rest: 0 },
];

export const dataLabels = {
  execution: 'Wykonanie',
  expense: 'Wydatki',
  income: 'Przychody',
  increase: 'Przyrost',
  month: 'Miesiąc',
  project: 'Projekt',
  rest: 'Reszta',
  total: 'Razem',
};
