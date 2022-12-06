import * as config from './plan.config';
import * as model from './plan.model';

export const planProjectEntities: model.PlanProject[] = [
  {
    expenses: 44222.15,
    incomes: 46287.00,
    increase: 2064.85,
    month: config.monthLabel.january.long,
    rest: 2064.85,
  },
  {
    expenses: 34511.15,
    incomes: 38212.60,
    increase: 5766.30,
    month: config.monthLabel.february.long,
    rest: 3701.45,
  },
  {
    expenses: 22211.15,
    incomes: 26840.60,
    increase: 10395.75,
    month: config.monthLabel.march.long,
    rest: 4629.45,
  },
  {
    expenses: 36999.15,
    incomes: 39435.80,
    increase: 12832.40,
    month: config.monthLabel.april.long,
    rest: 2436.65,
  },
  {
    expenses: 26911.15,
    incomes: 29989.40,
    increase: 15910.65,
    month: config.monthLabel.may.long,
    rest: 3078.25,
  },
  {
    expenses: 31501.06,
    incomes: 35787.00,
    increase: 20196.59,
    month: config.monthLabel.june.long,
    rest: 4285.94,
  },
  {
    expenses: 28049.21,
    incomes: 35787.00,
    increase: 27934.38,
    month: config.monthLabel.july.long,
    rest: 7737.79,
  },
  {
    expenses: 15721.21,
    incomes: 23191.80,
    increase: 35404.97,
    month: config.monthLabel.august.long,
    rest: 7470.59,
  },
  {
    expenses: 31671.21,
    incomes: 37361.40,
    increase: 41095.16,
    month: config.monthLabel.september.long,
    rest: 5690.19,
  },
  {
    expenses: 28602.71,
    incomes: 32638.20,
    increase: 45130.65,
    month: config.monthLabel.october.long,
    rest: 4035.49,
  },
  {
    expenses: 20214.71,
    incomes: 37361.40,
    increase: 62277.34,
    month: config.monthLabel.november.long,
    rest: 17146.69,
  },
  {
    expenses: 20214.71,
    incomes: 34212.60,
    increase: 76275.23,
    month: config.monthLabel.december.long,
    rest: 13997.89,
  },
];
