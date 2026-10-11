import * as fromModels from '@home-budget/finance/models';
import { DataProperty } from '@home-budget/finance/models/finance.enum';

function formData(data: fromModels.DataEntry[], financeConfig: fromModels.FinanceConfig): fromModels.DataSourceSummary[] {
  return data
    .map((entry: fromModels.DataEntry) => mapData(entry, financeConfig))
    .sort((first: fromModels.DataSourceSummary, last: fromModels.DataSourceSummary) => first.order - last.order)
    .map((entry: fromModels.DataSourceSummary) => formRestTotal(entry))
    .reduce((array: fromModels.DataSourceSummary[], entry: fromModels.DataSourceSummary, index: number) => {
      return formIncreaseTotal(array, entry, index);
    }, []);
}

function mapData(entry: fromModels.DataEntry, financeConfig: fromModels.FinanceConfig): fromModels.DataSourceSummary {
  const expense: number = formTotal(
    formEntry(entry, DataProperty.expense, financeConfig)
  );
  const income: number = formTotal(
    formEntry(entry, DataProperty.income, financeConfig)
  );

  return {
    expense,
    income,
    increase: 0,
    month: entry.key,
    order: entry.order,
    path: `${financeConfig.year}/entries/month/entries/${financeConfig.type}`,
    rest: 0,
  };
}

function formTotal(data: fromModels.DataEntryFinanceEntry): number {
  let total: number = 0;
  Object.keys(data)
    .forEach((key: string) => {
      if (data[key].isInTotal) {
        total += data[key].total;
      }
    });
  return total;
}

function formTotalAll(data: fromModels.DataEntryFinanceEntry): number {
  return Object.keys(data).reduce((total: number, key: string) => total + data[key].total, 0);
}

function formProjectTotal(data: fromModels.DataEntry[], financeConfig: fromModels.FinanceConfig): number {
  return data.reduce((total: number, entry: fromModels.DataEntry) => {
    const incomeAll = formTotalAll(formEntry(entry, DataProperty.income, financeConfig));
    const expenseAll = formTotalAll(formEntry(entry, DataProperty.expense, financeConfig));
    return total + incomeAll - expenseAll;
  }, 0);
}

function formRestTotal(entry: fromModels.DataSourceSummary): fromModels.DataSourceSummary {
  delete entry.order;
  return {
    ...entry,
    rest: entry.income - entry.expense,
  };
}

function formEntry(entry: fromModels.DataEntry, node: string, financeConfig: fromModels.FinanceConfig): fromModels.DataEntryFinanceEntry {
  return entry.entries[financeConfig.type].entries[node].entries;
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
  formProjectTotal,
};
