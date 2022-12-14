import * as model from './plan.model';

export const chartOption: model.ChartOption = {
  color: {
    blue: 'rgba(0, 132, 255, 1)',
    green: 'rgba(13, 157, 61, 1)',
    red: 'rgba(242, 38, 19, 1)',
    transparent: 'rgba(255, 255, 255, 0)',
  },
};

// TODO: to be deleted
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

export const monthLabel: model.MonthLabel = {
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

export const planColumns: string[] = [
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
