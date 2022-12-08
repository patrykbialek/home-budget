import * as config from './plan.config';
import * as model from './plan.model';

export const planProjectEntities: model.PlanProject[] = [
  {
    expenses: 0,
    incomes: 0,
    increase: 0,
    month: config.monthLabel.january.long,
    monthId: config.monthLabel.january.id,
    rest: 0,
  },
  {
    expenses: 0,
    incomes: 0,
    increase: 0,
    month: config.monthLabel.february.long,
    monthId: config.monthLabel.february.id,
    rest: 0,
  },
  {
    expenses: 0,
    incomes: 0,
    increase: 0,
    month: config.monthLabel.march.long,
    monthId: config.monthLabel.march.id,
    rest: 0,
  },
  {
    expenses: 0,
    incomes: 0,
    increase: 0,
    month: config.monthLabel.april.long,
    monthId: config.monthLabel.april.id,
    rest: 0,
  },
  {
    expenses: 0,
    incomes: 0,
    increase: 0,
    month: config.monthLabel.may.long,
    monthId: config.monthLabel.may.id,
    rest: 0,
  },
  {
    expenses: 0,
    incomes: 0,
    increase: 0,
    month: config.monthLabel.june.long,
    monthId: config.monthLabel.june.id,
    rest: 4285.94,
  },
  {
    expenses: 0,
    incomes: 0,
    increase: 0,
    month: config.monthLabel.july.long,
    monthId: config.monthLabel.july.id,
    rest: 0,
  },
  {
    expenses: 0,
    incomes: 0,
    increase: 0,
    month: config.monthLabel.august.long,
    monthId: config.monthLabel.august.id,
    rest: 0,
  },
  {
    expenses: 0,
    incomes: 0,
    increase: 0,
    month: config.monthLabel.september.long,
    monthId: config.monthLabel.september.id,
    rest: 0,
  },
  {
    expenses: 0,
    incomes: 0,
    increase: 0,
    month: config.monthLabel.october.long,
    monthId: config.monthLabel.october.id,
    rest: 0,
  },
  {
    expenses: 0,
    incomes: 0,
    increase: 0,
    month: config.monthLabel.november.long,
    monthId: config.monthLabel.november.id,
    rest: 0,
  },
  {
    expenses: 0,
    incomes: 0,
    increase: 0,
    month: config.monthLabel.december.long,
    monthId: config.monthLabel.december.id,
    rest: 0,
  },
];

export const data = {
  2023: {
    project: {
      january: {
        incomes: {
          patryk: {
            total: 0,
            entries: [
              {
                label: 'Working days',
                value: 0,
              },
              {
                label: 'Holiday days',
                value: 0,
              },
              {
                label: 'Working hours',
                value: 0,
              },
              {
                label: 'Rate',
                value: 0,
              },
              {
                label: 'Invoice net',
                value: 0,
              },
              {
                label: 'Tax vat',
                value: 0,
              },
              {
                label: 'Tax pit',
                value: 0,
              },
              {
                label: 'Zus',
                value: 0,
              },
              {
                label: 'Gross no zus',
                value: 0,
                isTotal: true,
              },
              {
                label: 'Net',
                value: 0,
              },
            ],
          },
          gosia: {
            total: 0,
            entries: [
              {
                label: 'Income',
                value: 0,
                isTotal: true,
              },
              {
                label: 'Extra income',
                value: 0,
                isTotal: true,
              },
            ],
          },
          other: {
            total: 0,
            entries: [
              {
                label: '500+',
                value: 0,
                isTotal: true,
              },
            ],
          },
        },
        expenses: {

        },
      },
    },
    execution: {},
  }
};
