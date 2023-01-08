import { combineLatest, forkJoin, Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { PlansHttpService } from './plans-http.service';
import { filter, take, tap } from 'rxjs/operators';
import { DataProperty } from '../models/plans.enum';
import { Router } from '@angular/router';
import { PlansBreadcrumbsService } from './plans-breadcrumbs.service';
import { dataLabels, defaultDataSource, labels, monthLabel, months } from '../shared/plans.config';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PlanAddColumnFormComponent, PlanDetailsFormComponent } from '../components';
import { BreadcrumbsItem } from '../models/plan-breadcrumbs.model';

import { PlansFormService } from './plans-form.service';

import * as _ from 'lodash';
import * as fromModels from '@home-budget/plans/models';

const commonLabels: string[] = ['month', 'monthId', 'order', 'path', 'parentPath', 'total'];

@Injectable({ providedIn: 'root' })
export class PlansService {
  public dataColumns: string[];
  public dataLabels: fromModels.DataLabels = dataLabels;
  public dataSource: fromModels.DataSourceDetails[] = [];
  public dataSourceFooter: fromModels.DataSourceDetails;
  public defaultDataSource: fromModels.DataSourceSummary[] = [];
  public displayedColumns: string[] = [];
  public form: FormGroup;

  private isLoadingOn: boolean = false;
  private parentPlanEntry: fromModels.PlanEntry;
  private readonly main: string = 'plan';

  constructor(
    public dialog: MatDialog,
    private readonly plansBreadcrumbsService: PlansBreadcrumbsService,
    private readonly plansHttpService: PlansHttpService,
    private readonly plansFormService: PlansFormService,
    private readonly router: Router,
  ) { }

  public get months(): fromModels.DataLabel[] {
    return months;
  }

  public get isLoading(): boolean {
    return this.isLoadingOn;
  }

  public readData(sourcePath: string): Observable<any> {
    return this.plansHttpService.readData(sourcePath);
  }

  public readDataByTypeObject(sourcePath: string): Observable<any> {
    return this.plansHttpService.readDataByTypeObject(sourcePath);
  }

  public readDataByType(sourcePath: string): Observable<any> {
    return this.plansHttpService.readDataByType(sourcePath);
  }

  public setDataLabelsAndColumns(data: fromModels.DataSourceDetails): void {
    const labels: fromModels.DataLabel[] = Object.keys(data)
      .map((key: string) => {
        return {
          key: key,
          order: data[key].order,
          value: <string>data[key].label,
        };
      })
      .sort((first: fromModels.DataLabel, last: fromModels.DataLabel) => first.order - last.order)
      .filter((entry: fromModels.DataLabel) => {
        return !commonLabels.includes(entry.key);
      })
      .map((entry: fromModels.DataLabel) => entry);

    this.setDataColumns(labels);
    this.setDataLabels(labels);
  }

  public setDataLabel(label: fromModels.DataLabel): void {
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

    labels.forEach((label: fromModels.DataLabel) => {
      this.setDataLabel(label);
    });
  }

  public setDefaultDataSource(): void {
    this.defaultDataSource = defaultDataSource;
  }

  public editPlanEntry(planEntry: fromModels.PlanEntry): void {
    const form: FormGroup = this.plansFormService.buildEditForm(planEntry);
    this.editDetails(form, planEntry);
  }

  public get currentEntries(): BreadcrumbsItem {
    return this.plansBreadcrumbsService.breadcrumbs
      .filter((breadcrumb: BreadcrumbsItem) => breadcrumb.isCurrent)
      .map((breadcrumb: BreadcrumbsItem) => {
        return {
          entry: breadcrumb.entry,
          path: `${breadcrumb.path}/${breadcrumb.entry}/entries`,
        };
      })[0];
  }

  public addPlanEntryColumn(): void {
    const form: FormGroup = this.plansFormService.buildAddColumnForm();
    this.openAddColumnDialog(form);
  }

  public goToDetails(planEntry: fromModels.PlanEntry): void {
    if (planEntry.href) {
      this.router.navigate([planEntry.href]);
      return;
    }

    this.formBreadcrumbs(planEntry);
    this.subscribeToReadData(planEntry);
    this.parentPlanEntry = planEntry;
  }

  private formBreadcrumbs(planEntry: fromModels.PlanEntry): void {
    this.plansBreadcrumbsService.formBreadcrumbs(planEntry, this.dataLabels);
  }

  private subscribeToReadData(planEntry: fromModels.PlanEntry): void {
    // TODO: replace path with generic one
    this.readData(`${'2023'}/entries`)
      .subscribe((data: fromModels.DataItem[]) => {
        this.formDataSource(planEntry, data);
        this.setDataSourceFooter();
        this.setDataLabelsAndColumns(this.dataSource[0]);
        this.setDisplayedColumns();
      });
  }

  private formDataSource(planEntry: fromModels.PlanEntry, data: fromModels.DataItem[]): void {
    const dataSourceEntryPath: string = `${planEntry.path}/${planEntry.entry}/entries`;
    this.dataSource = data
      .sort((first: fromModels.DataItem, last: fromModels.DataItem) => first.order - last.order)
      .map((entry: fromModels.DataItem) => {
        let total: number = 0;
        let dataItem: fromModels.DataSourceDetails = {
          month: entry.key,
          order: entry.order,
          path: dataSourceEntryPath,
          total,
        };

        const dataItemEntries: {
          dataItem: fromModels.DataSourceDetails; total: number;
        } = this.formDataItemEntries(total, dataItem, planEntry, entry, dataSourceEntryPath);
        dataItem = {
          ...dataItemEntries.dataItem,
          total: dataItemEntries.total,
        };
        return dataItem;
      });
  }

  private formEntries(planEntry: fromModels.PlanEntry, entry: fromModels.DataItem)
    : { [key: string]: fromModels.DataSourceDetailsEntry; } {
    const path1: string[] = planEntry.path.substring(18, planEntry.path.length).split('/');
    const path2: string = path1.join('.').concat(`.${planEntry.entry}.entries`);
    const path3: string = path2.substring(1, path2.length);
    return _.get(entry, path3);
  }

  private formDataItemEntries(total: number, dataItem: fromModels.DataSourceDetails,
    planEntry: fromModels.PlanEntry, entry: fromModels.DataItem, dataSourceEntryPath: string): {
      dataItem: fromModels.DataSourceDetails; total: number;
    } {
    const entries: { [key: string]: fromModels.DataSourceDetailsEntry; } = this.formEntries(planEntry, entry);
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

  private setDataSourceFooter(): void {
    const commonColumns: string[] = ['month', 'order', 'path', 'parentPath'];
    let rowTotals: fromModels.DataSourceDetails = {
      isInTotal: false,
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
    this.dataSource.forEach((entry: fromModels.DataSourceDetails) => {
      Object.keys(entry).forEach((key: string) => {
        if (key !== 'isInTotal' && entry[key].total >= 0) {
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

    this.dataSourceFooter = rowTotals;
  }

  public editDetails(form: FormGroup, planEntry: fromModels.PlanEntry): void {
    const dialogRef = this.dialog.open(PlanDetailsFormComponent, {
      data: { form, dataLabels: this.dataLabels },
    });

    dialogRef.afterClosed()
      .pipe(filter((callback: { form: FormGroup; }) => Boolean(callback)))
      .subscribe((callback: { form: FormGroup; isToDelete: boolean; }) => {
        const { entry, isInTotal, label, notes, order, path, total } = callback.form.value;
        this.setIsLoadingOn(true);
        if (callback.isToDelete) {
          this.deleteEntry(path, entry);
          return;
        }
        this.updateEntry({ entry, isInTotal, label, notes, order, path, total });
      });
  }

  public openAddColumnDialog(form: FormGroup): void {
    const dialogRef = this.dialog.open(PlanAddColumnFormComponent, {
      data: { form },
    });

    dialogRef.afterClosed()
      .pipe(filter((result: { form: FormGroup; }) => Boolean(result)))
      .subscribe((result: { form: FormGroup; }) => {
        this.setIsLoadingOn(true);
        this.addColumnToAllMonths(result);
      });
  }

  private deleteEntry(path: string, entry: fromModels.PlanEntry): void {
    let updatedPath: string = `${path}/${entry}`;
    const subs$: Observable<any>[] = [];

    const months: fromModels.DataLabel[] = this.months;
    months.forEach((month: fromModels.DataLabel) => {
      updatedPath = updatedPath.replace(month.key, 'month');
    });

    months.forEach((month: fromModels.DataLabel) => {
      const replacedPath = updatedPath.replace('month', month.key);
      subs$.push(this.plansHttpService.deletePlanEntry(replacedPath));
    });

    forkJoin(subs$)
      .subscribe(() => {
        setTimeout(() => {
          this.goToDetails(this.parentPlanEntry);
          this.setIsLoadingOn(false);
        }, 450);
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

    const months: fromModels.DataLabel[] = this.months;
    months.forEach((month: fromModels.DataLabel) => {
      path = path.replace(month.key, 'month');
    });

    months.forEach((month: fromModels.DataLabel) => {
      const replacedPath = path.replace('month', month.key);
      subs$.push(this.plansHttpService.readEntriesObject(replacedPath)
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

            this.plansHttpService.updateEntriesObject(replacedPath, entries);
          }))
      );
    });

    forkJoin(subs$)
      .subscribe(() => {
        setTimeout(() => {
          this.setIsLoadingOn(false);
        }, 450);
      });
  }

  private updateEntryLabelToAllMonths(payload: fromModels.UpadatePayload): void {
    const entry: string = payload.entry;
    const label: string = payload.label;

    let path: string = this.currentEntries.path;
    const months: fromModels.DataLabel[] = this.months;
    months.forEach((month: fromModels.DataLabel) => {
      path = path.replace(month.key, 'month');
    });

    months.forEach((month: fromModels.DataLabel) => {
      const replacedPath: string = path.replace('month', month.key);
      const updatedPayload: fromModels.UpadatePayload = {
        entry,
        label,
        path: replacedPath,
      };
      this.updateEntryLabel(updatedPayload);
    });
  }

  private formattedNumber(index: number): string {
    return ('0' + index).slice(-2);
  }

  private updateEntryLabel(payload: fromModels.UpadatePayload): void {
    this.plansHttpService.updateEntryLabel(payload)
      .pipe(take(1))
      .subscribe();
  }

  private updateEntry(payload: fromModels.UpadatePayload): void {
    this.plansHttpService.updateEntry(payload)
      .pipe(take(1))
      .subscribe(() => {
        this.updateParentTotals(payload.path);
        this.updateEntryLabelToAllMonths(payload);

        setTimeout(() => {
          this.goToDetails(this.parentPlanEntry);
          this.setIsLoadingOn(false);
        }, 450);
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
              tap((response: fromModels.DataItem) => {
                if (response.key !== 'entries') {
                  let total: number = 0;
                  const entries = response.value.entries;
                  Object.keys(entries)
                    .forEach((entryKey: string) => {
                      if (entries[entryKey].isInTotal) {
                        total += entries[entryKey].total;
                      }
                    });

                  const updatePayload: fromModels.UpadatePayload = {
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
    forkJoin(subs$)
      .subscribe();
  }

  private updateParentEntry(payload: fromModels.UpadatePayload): void {
    this.plansHttpService.updateParentEntry(payload)
      .pipe(take(1))
      .subscribe();
  }

  private setDisplayedColumns(): void {
    this.displayedColumns = [];
    this.displayedColumns.push(DataProperty.month);
    this.displayedColumns.push(DataProperty.total);
    this.displayedColumns = this.displayedColumns.concat([
      ...new Set(this.dataColumns),
    ]);
  }

  private setDataColumns(labels: fromModels.DataLabel[]): void {
    this.dataColumns = [];
    this.dataColumns = labels.map((label: fromModels.DataLabel) => label.key);
  }

  private setDataLabels(labels: fromModels.DataLabel[]): void {
    this.dataLabels = Object.assign(
      this.dataLabels,
      ...labels.map((item) => ({ [item.key]: item.value }))
    );
  }

  private setIsLoadingOn(isOn: boolean): void {
    this.isLoadingOn = isOn;
  }

}