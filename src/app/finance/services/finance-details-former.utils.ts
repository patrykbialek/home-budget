import * as _ from 'lodash';

import { DataItem, DataLabel, DataSourceDetails, DataSourceDetailsEntry, FinanceEntry } from '@home-budget/finance/models';
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
  const basePath: string = financeEntry.path ?? '';
  const path1: string[] = basePath.substring(18, basePath.length).split('/');
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

  Object.keys(dataSource[0])
    .forEach((key: string) => {
      if (!commonColumns.includes(key)) {
        rowTotals = {
          ...rowTotals,
          [key]: key === 'total' ? 0 : { total: 0 },
        };
      }
    });

  dataSource.forEach((entry: DataSourceDetails) => {
    Object.keys(entry).forEach((key: string) => {
      const cell = (entry as unknown as Record<string, DataSourceDetailsEntry>)[key];
      const totalCell = (rowTotals as unknown as Record<string, DataSourceDetailsEntry>)[key];
      if (key !== 'isInTotal' && cell.total >= 0 && cell && totalCell) {
        const total: number = totalCell.total + cell.total;
        rowTotals = {
          ...rowTotals,
          [key]: { total },
        };
      }
    });
  });

  Object.keys(rowTotals)
    .forEach((key: string) => {
      const cell = (rowTotals as unknown as Record<string, DataSourceDetailsEntry>)[key];
      const total = !['isInTotal', 'month', 'total'].includes(key)
        ? rowTotals.total + cell.total
        : 0;
      rowTotals = {
        ...rowTotals,
        isInTotal: cell.isInTotal,
        total,
      };
    });

  return rowTotals;
}

function formLabels(data: DataSourceDetails): DataLabel[] {
  return Object.keys(data)
    .map((key: string) => {
      const cell = (data as unknown as Record<string, DataSourceDetailsEntry>)[key];
      return {
        key,
        order: cell.order,
        value: cell.label as string,
      };
    })
    .sort((first: DataLabel, last: DataLabel) => (first.order ?? 0) - (last.order ?? 0))
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
