import * as fromModels from '@budgets/models';
import { DataProperty } from '@budgets/models/plans.enum';

function formData(data: fromModels.DataEntry[], config: fromModels.PlanConfig): fromModels.DataSourceSummary[] {
  return data
    .map((entry: fromModels.DataEntry) => mapData(entry, config))
    .sort((first: fromModels.DataSourceSummary, last: fromModels.DataSourceSummary) => first.order - last.order)
    .map((entry: fromModels.DataSourceSummary) => formRestTotal(entry))
    .reduce((array: fromModels.DataSourceSummary[], entry: fromModels.DataSourceSummary, index: number) => {
      return formIncreaseTotal(array, entry, index);
    }, []);
}

function mapData(entry: fromModels.DataEntry, config: fromModels.PlanConfig): fromModels.DataSourceSummary {
  const expense: number = formTotal(
    formEntry(entry, DataProperty.expense, config)
  );
  const income: number = formTotal(
    formEntry(entry, DataProperty.income, config)
  );

  return {
    expense,
    income,
    increase: 0,
    month: entry.key,
    order: entry.order,
    path: `${config.year}/entries/month/entries/${config.type}`,
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

function formEntry(entry: fromModels.DataEntry, node: string, config: fromModels.PlanConfig): fromModels.DataEntryPlanEntry {
  return entry.entries[config.type].entries[node].entries;
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
