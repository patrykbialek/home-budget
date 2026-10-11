import { DataItem, DataLabel, DataSourceDetails, DataSourceDetailsEntry, FinanceEntry } from '@home-budget/finance/models';
import * as _ from 'lodash';
import { months } from '../shared/finance.config';
const commonLabels: string[] = ['month', 'monthId', 'order', 'path', 'parentPath', 'total'];

function formData(financeEntry: FinanceEntry, data: DataItem[]): DataSourceDetails[] {
  return data
    .sort((first: DataItem, last: DataItem) => first.order - last.order)
    .map((entry: DataItem) => mapData(entry, financeEntry));
}

function mapData(entry: DataItem, financeEntry: FinanceEntry): DataSourceDetails {
  const dataSourceEntryPath: string = `${financeEntry.path}/${financeEntry.entry}/entries`;
  const total: number = 0;
  let dataItem: DataSourceDetails = {
    month: entry.key,
    order: entry.order,
    path: dataSourceEntryPath,
    total,
  };

  const dataItemEntries: {
    dataItem: DataSourceDetails; total: number;
  } = formDataItemEntries(total, dataItem, financeEntry, entry, dataSourceEntryPath);
  dataItem = {
    ...dataItemEntries.dataItem,
    total: dataItemEntries.total,
  };
  return dataItem;
}

function formDataItemEntries(
  total: number,
  dataItem: DataSourceDetails,
  financeEntry: FinanceEntry,
  entry: DataItem,
  dataSourceEntryPath: string,
): { dataItem: DataSourceDetails; total: number; } {
  const entries: { [key: string]: DataSourceDetailsEntry; } = formEntries(financeEntry, entry);
  Object.keys(entries)
    .forEach((key: string) => {
      if (entries[key].isInTotal) {
        total += entries[key].total;
      }
      dataItem = {
        ...dataItem,
        [key]: {
          hasEntries: Boolean(entries[key].entries),
          isInTotal: entries[key].isInTotal,
          label: entries[key].label,
          notes: entries[key].notes,
          order: entries[key].order,
          path: `${dataSourceEntryPath}/${entry}`,
          total: entries[key].total,
        }
      };
    });
  return { dataItem, total };
}

function formEntries(
  financeEntry: FinanceEntry,
  entry: DataItem,
): { [key: string]: DataSourceDetailsEntry; } {
  const path1: string[] = financeEntry.path.substring(18, financeEntry.path.length).split('/');
  const path2: string = path1.join('.').concat(`.${financeEntry.entry}.entries`);
  const path3: string = path2.substring(1, path2.length);
  return _.get(entry, path3);
}

function formDataFooter(dataSource: DataSourceDetails[]): DataSourceDetails {
  const commonColumns: string[] = ['month', 'order', 'path', 'parentPath'];
  let rowTotals: DataSourceDetails = {
    isInTotal: false,
    month: 'total',
    total: 0,
  };

  // NOTE: build rowTotals object
  Object.keys(dataSource[0])
    .forEach((key: string) => {
      if (!commonColumns.includes(key)) {
        rowTotals = {
          ...rowTotals,
          [key]: key === 'total' ? 0 : { total: 0 },
        };
      }
    });

  // NOTE: calculate totals
  dataSource.forEach((entry: DataSourceDetails) => {
    Object.keys(entry).forEach((key: string) => {
      if (key !== 'isInTotal' && entry[key].total >= 0 && entry[key] && rowTotals[key]) {
        const total: number = rowTotals[key].total + entry[key].total;
        rowTotals = {
          ...rowTotals,
          [key]: { total },
        };
      }
    });
  });

  // NOTE: caclulate total of totals
  Object.keys(rowTotals)
    .forEach((key: string) => {
      const total = !['isInTotal', 'month', 'total'].includes(key)
        ? rowTotals.total + rowTotals[key].total
        : 0;
      rowTotals = {
        ...rowTotals,
        isInTotal: rowTotals[key].isInTotal,
        total,
      };
    });

  return rowTotals;
}

function formLabels(data: DataSourceDetails): DataLabel[] {
  return Object.keys(data)
    .map((key: string) => {
      return {
        key,
        order: data[key].order,
        value: data[key].label as string,
      };
    })
    .sort((first: DataLabel, last: DataLabel) => first.order - last.order)
    .filter((entry: DataLabel) => !commonLabels.includes(entry.key) && Boolean(entry.value))
    .map((entry: DataLabel) => entry);
}

function formatNumber(index: number): string {
  return ('0' + index).slice(-2);
}

function formPathForDeleteEntry(path: string, entry: FinanceEntry): string {
  let updatedPath: string = `${path}/${entry}`;
  months.forEach((month: DataLabel) => {
    updatedPath = updatedPath.replace(month.key, 'month');
  });
  return updatedPath;
}

export {
  formatNumber,
  formData,
  formDataFooter,
  formLabels,
  formPathForDeleteEntry,
};
