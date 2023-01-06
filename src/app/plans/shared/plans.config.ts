import * as fromModels from '@home-budget/plans/models';

export const chartOption: fromModels.ChartOption = {
  color: {
    blue: 'rgba(0, 132, 255, 1)',
    green: 'rgba(13, 157, 61, 1)',
    red: 'rgba(242, 38, 19, 1)',
    transparent: 'rgba(255, 255, 255, 0)',
  },
};

// TODO: to be deleted
export const planType: any = {
  project: {
    id: 'project',
    long: 'Projekt',
  },
  execution: {
    id: 'execution',
    long: 'Wykonanie',
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
  { key: 'expenses', value: 'Wydatki' },
  { key: 'incomes', value: 'Przychody' },
  { key: 'month', value: 'Miesiąc' },
  { key: 'project', value: 'Projekt' },
  { key: 'total', value: 'Razem' },
];

export const planColumns: string[] = [
  'month', 'incomes', 'expenses', 'rest', 'increase',
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

export const defaultDataSource: any[] = [
  { month: 'jan', total: 0 },
  { month: 'feb', total: 0 },
  { month: 'mar', total: 0 },
  { month: 'apr', total: 0 },
  { month: 'may', total: 0 },
  { month: 'jun', total: 0 },
  { month: 'jul', total: 0 },
  { month: 'aug', total: 0 },
  { month: 'sep', total: 0 },
  { month: 'oct', total: 0 },
  { month: 'nov', total: 0 },
  { month: 'dec', total: 0 },
];

export const dataLabels = {
  execution: 'Wykonanie',
  expenses: 'Wydatki',
  incomes: 'Przychody',
  increase: 'Przyrost',
  month: 'Miesiąc',
  project: 'Projekt',
  rest: 'Reszta',
  total: 'Razem',
};
