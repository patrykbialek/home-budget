import * as config from './plan.config';
import * as model from './plan.model';

export const planProjectEntities: model.PlanProject[] = [
  {
    expenses: 44222.15,
    incomes: 46287.00,
    increase: 2064.85,
    month: config.monthLabel.january.long,
    monthId: config.monthLabel.january.id,
    rest: 2064.85,
  },
  {
    expenses: 34511.15,
    incomes: 38212.60,
    increase: 5766.30,
    month: config.monthLabel.february.long,
    monthId: config.monthLabel.february.id,
    rest: 3701.45,
  },
  {
    expenses: 22211.15,
    incomes: 26840.60,
    increase: 10395.75,
    month: config.monthLabel.march.long,
    monthId: config.monthLabel.march.id,
    rest: 4629.45,
  },
  {
    expenses: 36999.15,
    incomes: 39435.80,
    increase: 12832.40,
    month: config.monthLabel.april.long,
    monthId: config.monthLabel.april.id,
    rest: 2436.65,
  },
  {
    expenses: 26911.15,
    incomes: 29989.40,
    increase: 15910.65,
    month: config.monthLabel.may.long,
    monthId: config.monthLabel.may.id,
    rest: 3078.25,
  },
  {
    expenses: 31501.06,
    incomes: 35787.00,
    increase: 20196.59,
    month: config.monthLabel.june.long,
    monthId: config.monthLabel.june.id,
    rest: 4285.94,
  },
  {
    expenses: 28049.21,
    incomes: 35787.00,
    increase: 27934.38,
    month: config.monthLabel.july.long,
    monthId: config.monthLabel.july.id,
    rest: 7737.79,
  },
  {
    expenses: 15721.21,
    incomes: 23191.80,
    increase: 35404.97,
    month: config.monthLabel.august.long,
    monthId: config.monthLabel.august.id,
    rest: 7470.59,
  },
  {
    expenses: 31671.21,
    incomes: 37361.40,
    increase: 41095.16,
    month: config.monthLabel.september.long,
    monthId: config.monthLabel.september.id,
    rest: 5690.19,
  },
  {
    expenses: 28602.71,
    incomes: 32638.20,
    increase: 45130.65,
    month: config.monthLabel.october.long,
    monthId: config.monthLabel.october.id,
    rest: 4035.49,
  },
  {
    expenses: 20214.71,
    incomes: 37361.40,
    increase: 62277.34,
    month: config.monthLabel.november.long,
    monthId: config.monthLabel.november.id,
    rest: 17146.69,
  },
  {
    expenses: 20214.71,
    incomes: 34212.60,
    increase: 76275.23,
    month: config.monthLabel.december.long,
    monthId: config.monthLabel.december.id,
    rest: 13997.89,
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
