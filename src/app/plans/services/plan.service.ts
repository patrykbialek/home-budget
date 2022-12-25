import { combineLatest, forkJoin, Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { PlanHttpService } from './plan-http.service';
import { filter, take, tap } from 'rxjs/operators';
import { DataProperty } from '../plans.enum';
import { Router } from '@angular/router';
import { DataLabels, DataLabel, DataSourceDetails, PlanEntry, DataSourceDetailsEntry, DataItem, DataSourceSummary, UpadatePayload } from '../plans.model';
import { BreadcrumbsService } from './breadcrumbs.service';
import { dataLabels, defaultDataSource, labels, monthLabel, months } from '../plans.config';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PlanAddColumnFormComponent, PlanDetailsFormComponent } from '../components';
import { BreadcrumbsItem } from '../containers/plan-breadcrumbs/plan-breadcrumbs.model';

import * as _ from 'lodash';

const commonLabels: string[] = ['month', 'monthId', 'order', 'path', 'parentPath', 'total'];

@Injectable({ providedIn: 'root' })
export class PlanService {
  public dataColumns: string[];
  public dataLabels: DataLabels = dataLabels;
  public dataSource: DataSourceDetails[] = [];
  public dataSourceFooter: DataSourceDetails;
  public defaultDataSource: DataSourceSummary[] = [];
  public displayedColumns: string[] = [];
  public form: FormGroup;
  public isLoading: boolean;

  private parentPlanEntry: PlanEntry;
  private readonly main: string = 'plan';

  constructor(
    public dialog: MatDialog,
    private readonly breadcrumbsService: BreadcrumbsService,
    private readonly planHttpService: PlanHttpService,
    private readonly router: Router,
  ) { }

  public get months(): DataLabel[] {
    return months;
  }

  public readData(sourcePath: string): Observable<any> {
    return this.planHttpService.readData(sourcePath);
  }

  public readDataByTypeObject(sourcePath: string): Observable<any> {
    return this.planHttpService.readDataByTypeObject(sourcePath);
  }

  public readDataByType(sourcePath: string): Observable<any> {
    return this.planHttpService.readDataByType(sourcePath);
  }

  public setDataLabelsAndColumns(data: DataSourceDetails): void {
    const labels: DataLabel[] = Object.keys(data)
      .map((key: string) => {
        return {
          key: key,
          order: data[key].order,
          value: <string>data[key].label,
        };
      })
      .sort((first: DataLabel, last: DataLabel) => first.order - last.order)
      .filter((entry: DataLabel) => {
        return !commonLabels.includes(entry.key);
      })
      .map((entry: DataLabel) => entry);

    this.setDataColumns(labels);
    this.setDataLabels(labels);
  }

  public setDataLabel(label: DataLabel): void {
    this.dataLabels = {
      ...this.dataLabels,
      [label.key]: label.value,
    };
  }

  public setCommonDataLables(): void {
    Object.keys(monthLabel).forEach((monthKey: string) => {
      this.setDataLabel({
        key: monthLabel[monthKey].id,
        value: monthLabel[monthKey].long,
      });
    });

    labels.forEach((label: DataLabel) => {
      this.setDataLabel(label);
    });
  }

  public setDefaultDataSource(): void {
    this.defaultDataSource = defaultDataSource;
  }

  public editPlanEntry(planEntry: PlanEntry): void {
    const form: FormGroup = this.buildEditForm(planEntry);
    this.editDetails(form, planEntry);
  }

  public get currentEntries(): BreadcrumbsItem {
    return this.breadcrumbsService.breadcrumbs
      .filter((breadcrumb: BreadcrumbsItem) => breadcrumb.isCurrent)
      .map((breadcrumb: BreadcrumbsItem) => {
        return {
          entry: breadcrumb.entry,
          path: `${breadcrumb.path}/${breadcrumb.entry}/entries`,
        };
      })[0];
  }

  public addColumn(): void {
    const form: FormGroup = new FormGroup({
      hasEntries: new FormControl(),
      label: new FormControl(),
      order: new FormControl(),
    });

    this.openAddColumnDialog(form);
  }

  public goToDetails(planEntry: PlanEntry): void {
    if (planEntry.href) {
      this.router.navigate([planEntry.href]);
      return;
    }

    this.formBreadcrumbs(planEntry);
    this.subscribeToReadData(planEntry);
    this.parentPlanEntry = planEntry;
  }

  private formBreadcrumbs(planEntry: PlanEntry): void {
    this.breadcrumbsService.formBreadcrumbs(planEntry, this.dataLabels);
  }

  private subscribeToReadData(planEntry: PlanEntry): void {
    // TODO: replace path with generic one
    this.readData(`${'2023'}/entries`)
      .subscribe((data: DataItem[]) => {
        this.formDataSource(planEntry, data);
        this.setDataSourceFooter();
        this.setDataLabelsAndColumns(this.dataSource[0]);
        this.setDisplayedColumns();
      });
  }

  private formDataSource(planEntry: PlanEntry, data: DataItem[]): void {
    const dataSourceEntryPath: string = `${planEntry.path}/${planEntry.entry}/entries`;
    this.dataSource = data
      .sort((first: DataItem, last: DataItem) => first.order - last.order)
      .map((entry: DataItem) => {
        let total: number = 0;
        let dataItem: DataSourceDetails = {
          month: entry.key,
          order: entry.order,
          path: dataSourceEntryPath,
          total,
        };

        const dataItemEntries: {
          dataItem: DataSourceDetails; total: number;
        } = this.formDataItemEntries(total, dataItem, planEntry, entry, dataSourceEntryPath);
        dataItem = {
          ...dataItemEntries.dataItem,
          total: dataItemEntries.total,
        };
        return dataItem;
      });
  }

  private formEntries(planEntry: PlanEntry, entry: DataItem): { [key: string]: DataSourceDetailsEntry; } {
    const path1: string[] = planEntry.path.substring(18, planEntry.path.length).split('/');
    const path2: string = path1.join('.').concat(`.${planEntry.entry}.entries`);
    const path3: string = path2.substring(1, path2.length);
    return _.get(entry, path3);
  }

  private formDataItemEntries(total: number, dataItem: DataSourceDetails,
    planEntry: PlanEntry, entry: DataItem, dataSourceEntryPath: string): {
      dataItem: DataSourceDetails; total: number;
    } {
    const entries: { [key: string]: DataSourceDetailsEntry; } = this.formEntries(planEntry, entry);
    Object.keys(entries)
      .forEach((entry: string) => {
        total += entries[entry].total;
        dataItem = {
          ...dataItem,
          [entry]: {
            hasEntries: Boolean(entries[entry].entries),
            label: entries[entry].label,
            notes: entries[entry].notes,
            order: entries[entry].order,
            path: `${dataSourceEntryPath}/${entry}`,
            total: entries[entry].total,
          }
        };
      });
    return { dataItem, total };
  }

  private setDataSourceFooter(): void {
    const commonColumns: string[] = ['month', 'order', 'path', 'parentPath'];
    let rowTotals = {
      month: 'total',
      total: 0,
    };

    // NOTE: build rowTotals object
    Object.keys(this.dataSource[0])
      .forEach((key: string) => {
        if (!commonColumns.includes(key))
          rowTotals = {
            ...rowTotals,
            [key]: key === 'total' ? 0 : { total: 0 },
          };
      });

    // NOTE: calculate totals
    this.dataSource.forEach((entry: DataSourceDetails) => {
      Object.keys(entry).forEach((key: string) => {
        if (entry[key].total >= 0) {
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
        const total = !['month', 'total'].includes(key)
          ? rowTotals.total + rowTotals[key].total
          : 0;
        rowTotals = {
          ...rowTotals,
          total,
        };
      });

    this.dataSourceFooter = rowTotals;
  }

  public editDetails(form: FormGroup, planEntry: PlanEntry): void {
    const dialogRef = this.dialog.open(PlanDetailsFormComponent, {
      data: { form, dataLabels: this.dataLabels },
    });

    dialogRef.afterClosed()
      .pipe(filter((callback: { form: FormGroup; }) => Boolean(callback)))
      .subscribe((callback: { form: FormGroup; isToDelete: boolean; }) => {
        const { total, path, entry, notes, order } = callback.form.value;
        if (callback.isToDelete) {
          this.deleteEntry(path, entry);
          return;
        }
        this.updateEntry({ entry, order, path, notes, total });
      });
  }

  public openAddColumnDialog(form: FormGroup): void {
    const dialogRef = this.dialog.open(PlanAddColumnFormComponent, {
      data: { form },
    });

    dialogRef.afterClosed()
      .pipe(filter((result: { form: FormGroup; }) => Boolean(result)))
      .subscribe((result: { form: FormGroup; }) => {
        this.addColumnToAllMonths(result);
      });
  }

  private deleteEntry(path: string, entry: PlanEntry): void {
    let updatedPath: string = `${path}/${entry}`;
    const subs$: Observable<any>[] = [];

    const months: DataLabel[] = this.months;
    months.forEach((month: DataLabel) => {
      updatedPath = updatedPath.replace(month.key, 'month');
    });

    months.forEach((month: DataLabel) => {
      const replacedPath = updatedPath.replace('month', month.key);
      subs$.push(this.planHttpService.deletePlanEntry(replacedPath));
    });

    combineLatest(subs$)
      .subscribe(() => {
        setTimeout(() => {
          this.goToDetails(this.parentPlanEntry);
        });
      });
  }

  private addColumnToAllMonths(result: { form: FormGroup; }): void {
    let path: string = this.currentEntries.path;
    const entry: string = this.currentEntries.entry;
    const subs$: Observable<any>[] = [];

    let payload: any = {
      isInTotal: true,
      label: result.form.value.label,
      notes: null,
      order: result.form.value.order,
      total: 0,
    };

    const months: DataLabel[] = this.months;
    months.forEach((month: DataLabel) => {
      path = path.replace(month.key, 'month');
    });

    months.forEach((month: DataLabel) => {
      const replacedPath = path.replace('month', month.key);
      subs$.push(this.planHttpService.readEntriesObject(replacedPath)
        .pipe(
          take(1),
          tap((entries: any) => {
            const lastIndex: number = Object.keys(entries).length + 1;
            const key: string = `${entry}${this.formattedNumber(lastIndex)}`;

            if (result.form.value.hasEntries) {
              const childKey: string = `${key}${this.formattedNumber(1)}`;
              payload = {
                ...payload,
                entries: {
                  [childKey]: {
                    isInTotal: true,
                    label: `${result.form.value.label} 1`,
                    order: 1,
                    total: 0,
                  }
                }
              };
            }

            entries = {
              ...entries,
              [key]: payload,
            };

            this.planHttpService.updateEntriesObject(replacedPath, entries);
          }))
      );
    });

    combineLatest(subs$).subscribe();
  }

  private formattedNumber(index: number): string {
    return ('0' + index).slice(-2);
  }

  private updateEntry(payload: UpadatePayload): void {
    this.planHttpService.updateEntry(payload)
      .pipe(take(1))
      .subscribe(() => {
        setTimeout(() => {
          this.goToDetails(this.parentPlanEntry);
        });
        this.updateParentTotals(payload.path);
      });
  }

  private updateParentTotals(path: string): void {
    let newPath: string[] = path.split('/');
    const len: number = ((newPath.length - 6));
    const subs$ = [];
    for (let i = 0; i < len; i++) {
      newPath = newPath.slice(0, -1);

      if (newPath[newPath.length - 1] !== 'entries') {
        const path = newPath.join('/').split('/').slice(0, -1).join('/');
        subs$.push(
          this.readDataByTypeObject(newPath.join('/'))
            .pipe(
              take(len / 2),
              tap((response: DataItem) => {
                if (response.key !== 'entries') {
                  let total = 0;
                  const entries = response.value.entries;
                  Object.keys(entries)
                    .forEach((entryKey: string) => {
                      total += entries[entryKey].total;
                    });

                  const updatePayload: UpadatePayload = {
                    path,
                    entry: response.key,
                    total: parseFloat(total.toFixed(2)),
                  };
                  this.updateParentEntry(updatePayload);
                }
              })
            )
        );
      }
    }
    forkJoin(subs$).subscribe();
  }

  private updateParentEntry(payload: UpadatePayload): void {
    this.planHttpService.updateParentEntry(payload)
      .pipe(take(1)).subscribe();
  }

  private setDisplayedColumns(): void {
    this.displayedColumns = [];
    this.displayedColumns.push(DataProperty.month);
    this.displayedColumns.push(DataProperty.total);
    this.displayedColumns = this.displayedColumns.concat([
      ...new Set(this.dataColumns),
    ]);
  }

  private setDataColumns(labels: DataLabel[]): void {
    this.dataColumns = [];
    this.dataColumns = labels.map((label: DataLabel) => label.key);
  }

  private setDataLabels(labels: DataLabel[]): void {
    this.dataLabels = Object.assign(
      this.dataLabels,
      ...labels.map((item) => ({ [item.key]: item.value }))
    );
  }

  private buildEditForm(planEntry: PlanEntry): FormGroup {
    return new FormGroup({
      entry: new FormControl(planEntry.entry),
      hasEntries: new FormControl(planEntry.hasEntries),
      month: new FormControl(planEntry.month),
      notes: new FormControl(planEntry.notes),
      order: new FormControl(planEntry.order),
      path: new FormControl(planEntry.path.replace('month', planEntry.month)),
      total: new FormControl(planEntry.total),
    });
  }

}
