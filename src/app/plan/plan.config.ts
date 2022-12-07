import * as model from './plan.model';

export const chartOption: model.ChartOption = {
  color: {
    blue: 'rgba(0, 132, 255, 1)',
    green: 'rgba(13, 157, 61, 1)',
    red: 'rgba(242, 38, 19, 1)',
    transparent: 'rgba(255, 255, 255, 0)',
  },
};

export const planType: model.PlanType = {
  project: {
    id: 'project',
    long: 'Projekt',
  },
  execution: {
    id: 'execution',
    long: 'Wykonanie',
  },
};

export const transactionType: model.TransactionType = {
  expenses: {
    id: 'expenses',
    long: 'Wydatki',
  },
  incomes: {
    id: 'incomes',
    long: 'Przychody',
  },
  rest: {
    id: 'rest',
    long: 'Reszta',
  },
  increase: {
    id: 'increase',
    long: 'Przyrost',
  },
};

export const monthLabel: model.MonthLabel = {
  january: {
    id: 'january',
    long: 'Styczeń',
    short: 'Sty',
  },
  february: {
    id: 'february',
    long: 'Luty',
    short: 'Lut',
  },
  march: {
    id: 'march',
    long: 'Marzec',
    short: 'Mar',
  },
  april: {
    id: 'april',
    long: 'Kwiecień',
    short: 'Kwi',
  },
  may: {
    id: 'may',
    long: 'Maj',
    short: 'Maj',
  },
  june: {
    id: 'june',
    long: 'Czerwiec',
    short: 'Cze',
  },
  july: {
    id: 'july',
    long: 'Lipiec',
    short: 'LIp',
  },
  august: {
    id: 'august',
    long: 'Sierpień',
    short: 'Sie',
  },
  september: {
    id: 'september',
    long: 'Wrzesień',
    short: 'Wrz',
  },
  october: {
    id: 'october',
    long: 'Październik',
    short: 'Paź',
  },
  november: {
    id: 'november',
    long: 'Listopad',
    short: 'Lis',
  },
  december: {
    id: 'december',
    long: 'Grudzień',
    short: 'Gru',
  },
};

export const planProjectDetailsColumns: string[] = [
  'month', 'incomes', 'expenses', 'rest', 'increase',
];

export const navLinks: model.NavLink[] = [
  {
    label: 'Projekt',
    link: './project',
    index: 0,
  },
  {
    label: 'Wykonanie',
    link: './execution',
    index: 1,
  },
];
