import * as fromModels from '@budgets/models';
import * as _ from 'lodash';
import { months } from '../shared/budgets.config';
const commonLabels: string[] = ['month', 'monthId', 'order', 'path', 'parentPath', 'total'];

function formData(planEntry: fromModels.PlanEntry, data: fromModels.DataItem[]): fromModels.DataSourceDetails[] {
  return data
    .sort((first: fromModels.DataItem, last: fromModels.DataItem) => first.order - last.order)
    .map((entry: fromModels.DataItem) => mapData(entry, planEntry));
}

function mapData(entry: fromModels.DataItem, planEntry: fromModels.PlanEntry): fromModels.DataSourceDetails {
  const dataSourceEntryPath: string = `${planEntry.path}/${planEntry.entry}/entries`;
  const total: number = 0;
  let dataItem: fromModels.DataSourceDetails = {
    month: entry.key,
    order: entry.order,
    path: dataSourceEntryPath,
    total,
  };

  const dataItemEntries: {
    dataItem: fromModels.DataSourceDetails; total: number;
  } = formDataItemEntries(total, dataItem, planEntry, entry, dataSourceEntryPath);
  dataItem = {
    ...dataItemEntries.dataItem,
    total: dataItemEntries.total,
  };
  return dataItem;
}

function formDataItemEntries(
  total: number,
  dataItem: fromModels.DataSourceDetails,
  planEntry: fromModels.PlanEntry,
  entry: fromModels.DataItem,
  dataSourceEntryPath: string,
): { dataItem: fromModels.DataSourceDetails; total: number; } {
  const entries: { [key: string]: fromModels.DataSourceDetailsEntry; } = formEntries(planEntry, entry);
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
  planEntry: fromModels.PlanEntry,
  entry: fromModels.DataItem,
): { [key: string]: fromModels.DataSourceDetailsEntry; } {
  const path1: string[] = planEntry.path.substring(18, planEntry.path.length).split('/');
  const path2: string = path1.join('.').concat(`.${planEntry.entry}.entries`);
  const path3: string = path2.substring(1, path2.length);
  return _.get(entry, path3);
}

function formDataFooter(dataSource: fromModels.DataSourceDetails[]): fromModels.DataSourceDetails {
  const commonColumns: string[] = ['month', 'order', 'path', 'parentPath'];
  let rowTotals: fromModels.DataSourceDetails = {
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
  dataSource.forEach((entry: fromModels.DataSourceDetails) => {
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

function formLabels(data: fromModels.DataSourceDetails): fromModels.DataLabel[] {
  return Object.keys(data)
    .map((key: string) => {
      return {
        key,
        order: data[key].order,
        value: data[key].label as string,
      };
    })
    .sort((first: fromModels.DataLabel, last: fromModels.DataLabel) => first.order - last.order)
    .filter((entry: fromModels.DataLabel) => !commonLabels.includes(entry.key))
    .map((entry: fromModels.DataLabel) => entry);
}

function formatdNumber(index: number): string {
  return ('0' + index).slice(-2);
}

function formPathForDeleteEntry(path: string, entry: fromModels.PlanEntry): string {
  let updatedPath: string = `${path}/${entry}`;
  months.forEach((month: fromModels.DataLabel) => {
    updatedPath = updatedPath.replace(month.key, 'month');
  });
  return updatedPath;
}

export {
  formatdNumber,
  formData,
  formDataFooter,
  formLabels,
  formPathForDeleteEntry,
};
