import * as model from './plan.model';

export const chartOption: model.ChartOption = {
  color: {
    blue: 'rgba(0, 132, 255, 1)',
    green: 'rgba(13, 157, 61, 1)',
    red: 'rgba(242, 38, 19, 1)',
    transparent: 'rgba(255, 255, 255, 0)',
  },
};

export const monthLabel: model.MonthLabel = {
  january: {
    long: 'Styczeń',
    short: 'Sty',
  },
  february: {
    long: 'Luty',
    short: 'Lut',
  },
  march: {
    long: 'Marzec',
    short: 'Mar',
  },
  april: {
    long: 'Kwiecień',
    short: 'Kwi',
  },
  may: {
    long: 'Maj',
    short: 'Maj',
  },
  june: {
    long: 'Czerwiec',
    short: 'Cze',
  },
  july: {
    long: 'Lipiec',
    short: 'LIp',
  },
  august: {
    long: 'Sierpień',
    short: 'Sie',
  },
  september: {
    long: 'Wrzesień',
    short: 'Wrz',
  },
  october: {
    long: 'Październik',
    short: 'Paź',
  },
  november: {
    long: 'Listopad',
    short: 'Lis',
  },
  december: {
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
