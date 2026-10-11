import { DataEntry, DataEntryFinanceEntry, DataSourceSummary, FinanceConfig } from '@home-budget/finance/models';
import { DataProperty } from '@home-budget/finance/models/finance.enum';

function formData(data: DataEntry[], financeConfig: FinanceConfig): DataSourceSummary[] {
  return data
    .map((entry: DataEntry) => mapData(entry, financeConfig))
    .sort((first: DataSourceSummary, last: DataSourceSummary) => (first.order ?? 0) - (last.order ?? 0))
    .map((entry: DataSourceSummary) => formRestTotal(entry))
    .reduce((array: DataSourceSummary[], entry: DataSourceSummary, index: number) => {
      return formIncreaseTotal(array, entry, index);
    }, []);
}

function mapData(entry: DataEntry, financeConfig: FinanceConfig): DataSourceSummary {
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

function formTotal(data: Record<string, DataEntryFinanceEntry>): number {
  let total: number = 0;
  Object.keys(data)
    .forEach((key: string) => {
      if (data[key].isInTotal) {
        total += data[key].total;
      }
    });
  return total;
}

function formTotalAll(data: Record<string, DataEntryFinanceEntry>): number {
  return Object.keys(data).reduce((total: number, key: string) => total + data[key].total, 0);
}

function formProjectTotal(data: DataEntry[], financeConfig: FinanceConfig): number {
  return data.reduce((total: number, entry: DataEntry) => {
    const incomeAll = formTotalAll(formEntry(entry, DataProperty.income, financeConfig));
    const expenseAll = formTotalAll(formEntry(entry, DataProperty.expense, financeConfig));
    return total + incomeAll - expenseAll;
  }, 0);
}

function formRestTotal(entry: DataSourceSummary): DataSourceSummary {
  delete entry.order;
  return {
    ...entry,
    rest: entry.income - entry.expense,
  };
}

function formEntry(entry: DataEntry, node: string, financeConfig: FinanceConfig): Record<string, DataEntryFinanceEntry> {
  return entry.entries[financeConfig.type as 'execution' | 'project'].entries[node as 'expense' | 'income'].entries ?? {};
}

function formIncreaseTotal(
  array: DataSourceSummary[],
  entry: DataSourceSummary,
  index: number,
): DataSourceSummary[] {
  const current: DataSourceSummary = { ...entry };
  const previous: DataSourceSummary = array[index - 1];
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
