import * as fromModels from '@home-budget/plans/models';
import { DataProperty } from '@home-budget/plans/models/plans.enum';

function formData(data: fromModels.DataEntry[], planConfig: fromModels.PlanConfig): fromModels.DataSourceSummary[] {
  return data
    .map((entry: fromModels.DataEntry) => mapData(entry, planConfig))
    .sort((first: fromModels.DataSourceSummary, last: fromModels.DataSourceSummary) => first.order - last.order)
    .map((entry: fromModels.DataSourceSummary) => formRestTotal(entry))
    .reduce((array: fromModels.DataSourceSummary[], entry: fromModels.DataSourceSummary, index: number) => {
      return formIncreaseTotal(array, entry, index);
    }, []);
}

function mapData(entry: fromModels.DataEntry, planConfig: fromModels.PlanConfig): fromModels.DataSourceSummary {
  const expense: number = formTotal(
    formEntry(entry, DataProperty.expense, planConfig)
  );
  const income: number = formTotal(
    formEntry(entry, DataProperty.income, planConfig)
  );

  return {
    expense,
    income,
    increase: 0,
    month: entry.key,
    order: entry.order,
    path: `${planConfig.year}/entries/month/entries/${planConfig.type}`,
    rest: 0,
  };
}

function formTotal(data: fromModels.DataEntryPlanEntry): number {
  let total: number = 0;
  Object.keys(data)
    .forEach((key: string) => {
      if (data[key].isInTotal) {
        total += data[key].total;
      }
    });
  return total;
}

function formRestTotal(entry: fromModels.DataSourceSummary): fromModels.DataSourceSummary {
  delete entry.order;
  return {
    ...entry,
    rest: entry.income - entry.expense,
  };
}

function formEntry(entry: fromModels.DataEntry, node: string, planConfig: fromModels.PlanConfig): fromModels.DataEntryPlanEntry {
  return entry.entries[planConfig.type].entries[node].entries;
}

function formIncreaseTotal(
  array: fromModels.DataSourceSummary[],
  entry: fromModels.DataSourceSummary,
  index: number,
): fromModels.DataSourceSummary[] {
  const current: fromModels.DataSourceSummary = { ...entry };
  const previous: fromModels.DataSourceSummary = array[index - 1];
  current.increase =
    index === 0
      ? current.rest
      : previous.increase + current.rest;
  array.push(current);
  return array;
}

export {
  formData,
};
