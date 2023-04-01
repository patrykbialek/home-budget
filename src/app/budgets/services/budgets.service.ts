import { FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { forkJoin, Observable } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';

import * as _ from 'lodash';

import { BudgetsBreadcrumbsService } from '@budgets/services/budgets-breadcrumbs.service';
import { BudgetsHttpService } from '@budgets/services/budgets-http.service';
import { BugdetsFormService } from '@budgets/services/budgets-form.service';

import { BudgetAddColumnFormComponent, BudgetEditFormComponent } from '../components';

import * as fromModels from '@budgets/models';
import * as fromUtils from '@budgets/services/budget-details-former.utils';
import * as fromConfig from '@budgets/shared/budgets.config';
import * as fromEnums from '@budgets/models/plans.enum';

@Injectable({ providedIn: 'root' })
export class BudgetsService {
  public dataColumns: string[];
  public dataLabels: fromModels.DataLabels = fromConfig.dataLabels;
  public dataSource: fromModels.DataSourceDetails[] = [];
  public dataSourceFooter: fromModels.DataSourceDetails;
  public defaultDataSource: fromModels.DataSourceSummary[] = fromConfig.defaultDataSource;
  public displayedColumns: string[] = [];
  public form: FormGroup;

  private isLoadingOn: boolean = false;
  private parentPlanEntry: fromModels.PlanEntry;

  constructor(
    public dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly budgetsBreadcrumbsService: BudgetsBreadcrumbsService,
    private readonly budgetsFormService: BugdetsFormService,
    private readonly budgetsHttpService: BudgetsHttpService,
    private readonly router: Router,
  ) { }

  public get months(): fromModels.DataLabel[] {
    return fromConfig.months;
  }

  public get labels(): fromModels.DataLabel[] {
    return fromConfig.labels;
  }

  public get isLoading(): boolean {
    return this.isLoadingOn;
  }

  public get currentEntries(): fromModels.BreadcrumbsItem {
    return this.budgetsBreadcrumbsService.breadcrumbs
      .filter((breadcrumb: fromModels.BreadcrumbsItem) => breadcrumb.isCurrent)
      .map((breadcrumb: fromModels.BreadcrumbsItem) => {
        return {
          entry: breadcrumb.entry,
          path: `${breadcrumb.path}/${breadcrumb.entry}/entries`,
        };
      })[0];
  }

  public readData(sourcePath: string): Observable<any> {
    return this.budgetsHttpService.readData(sourcePath);
  }

  public readDataByTypeObject(sourcePath: string): Observable<any> {
    return this.budgetsHttpService.readDataByTypeObject(sourcePath);
  }

  public readDataByType(sourcePath: string): Observable<any> {
    return this.budgetsHttpService.readDataByType(sourcePath);
  }

  private formDataLabelsAndColumns(data: fromModels.DataSourceDetails): void {
    this.formDataColumns(fromUtils.formLabels(data));
    this.formDataLabels(fromUtils.formLabels(data));
  }

  private setDataLabel(label: fromModels.DataLabel): void {
    this.dataLabels = {
      ...this.dataLabels,
      [label.key]: label.value,
    };
  }

  public setCommonDataLables(): void {
    Object.keys(fromConfig.monthLabel).forEach((key: string) => {
      this.setDataLabel({
        key: fromConfig.monthLabel[key].id,
        value: fromConfig.monthLabel[key].long,
      });
    });

    this.labels.forEach((label: fromModels.DataLabel) => {
      this.setDataLabel(label);
    });
  }

  public editPlanEntry(planEntry: fromModels.PlanEntry): void {
    const form: FormGroup = this.budgetsFormService.buildEditForm(planEntry);
    this.editDetails(form);
  }

  public addPlanEntryColumn(): void {
    const form: FormGroup = this.budgetsFormService.buildAddColumnForm();
    this.addColumn(form);
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

  private editDetails(form: FormGroup): void {
    const dialogRef: MatDialogRef<BudgetEditFormComponent> = this.dialog.open(BudgetEditFormComponent, {
      data: { form, dataLabels: this.dataLabels },
      position: { top: '64px' },
    });

    dialogRef.afterClosed()
      .pipe(filter((callback: { form: FormGroup; }) => Boolean(callback)))
      .subscribe((callback: { form: FormGroup; isToDelete: boolean; }) => {
        this.handleAfterEditDialogClose(callback.form, callback.isToDelete);
      });
  }

  private handleAfterEditDialogClose(form: FormGroup, isToDelete: boolean): void {
    const { entry, isInTotal, label, notes, order, path, total } = form.value;
    this.setIsLoadingOn(true);
    if (isToDelete) {
      this.deleteEntry(path, entry);
      return;
    }
    this.updateEntry({ entry, isInTotal, label, notes, order, path, total });
  }

  private addColumn(form: FormGroup): void {
    const dialogRef = this.dialog.open(BudgetAddColumnFormComponent, {
      data: { form },
      position: { top: '64px' },
    });

    dialogRef.afterClosed()
      .pipe(filter((callback: { form: FormGroup; }) => Boolean(callback)))
      .subscribe((callback: { form: FormGroup; }) => {
        this.handleAfterAddColumnDialogClose(callback.form);
      });
  }

  private handleAfterAddColumnDialogClose(form: FormGroup): void {
    this.setIsLoadingOn(true);
    this.addColumnToAllMonths(form);
  }

  private formBreadcrumbs(planEntry: fromModels.PlanEntry): void {
    this.budgetsBreadcrumbsService.formBreadcrumbs(planEntry, this.dataLabels);
  }

  private subscribeToReadData(planEntry: fromModels.PlanEntry): void {
    // TODO: replace path with generic one
    this.readData(`${'2023'}/entries`)
      .subscribe((data: fromModels.DataItem[]) => {
        this.formDataSource(planEntry, data);
        this.formDataSourceFooter();
        this.formDataLabelsAndColumns(this.dataSource[0]);
        this.setDisplayedColumns();
      });
  }

  private formDataSource(planEntry: fromModels.PlanEntry, data: fromModels.DataItem[]): void {
    this.dataSource = fromUtils.formData(planEntry, data);
  }

  private formDataSourceFooter(): void {
    this.dataSourceFooter = fromUtils.formDataFooter(this.dataSource);
  }

  private deleteEntry(path: string, entry: fromModels.PlanEntry): void {
    const updatedPath: string = fromUtils.formPathForDeleteEntry(path, entry);
    const subs$: Observable<any>[] = [];
    this.months.forEach((month: fromModels.DataLabel) => {
      const replacedPath: string = updatedPath.replace('month', month.key);
      subs$.push(this.budgetsHttpService.deleteEntry(replacedPath));
    });

    forkJoin(subs$)
      .subscribe(() => this.handleAfterDeleteEntry());
  }

  private handleAfterDeleteEntry(): void {
    setTimeout(() => {
      this.goToDetails(this.parentPlanEntry);
      this.setIsLoadingOn(false);
      this.openSnackBar('Dane zapisane.');
    }, 450);
  }

  private addColumnToAllMonths(form: FormGroup): void {
    let path: string = this.currentEntries.path;
    const entry: string = this.currentEntries.entry;
    const subs$: Observable<any>[] = [];

    let payload: any = {
      isInTotal: true,
      label: form.value.label,
      notes: null,
      order: form.value.order,
      total: 0,
    };

    this.months.forEach((month: fromModels.DataLabel) => {
      path = path.replace(month.key, 'month');
    });

    this.months.forEach((month: fromModels.DataLabel) => {
      const replacedPath = path.replace('month', month.key);
      subs$.push(this.budgetsHttpService.readEntriesObject(replacedPath)
        .pipe(
          take(1),
          tap((entries: any) => {
            const lastIndex: number = Object.keys(entries).length + 1;
            const key: string = `${entry}${fromUtils.formatdNumber(lastIndex)}`;

            if (form.value.hasEntries) {
              const childKey: string = `${key}${fromUtils.formatdNumber(1)}`;
              payload = {
                ...payload,
                entries: {
                  [childKey]: {
                    isInTotal: true,
                    label: `${form.value.label} 1`,
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

            this.budgetsHttpService.updateEntriesObject(replacedPath, entries);
          }))
      );
    });

    forkJoin(subs$)
      .subscribe(() => this.handleAfterAddColumnToAllMonths());
  }

  private handleAfterAddColumnToAllMonths(): void {
    setTimeout(() => {
      this.setIsLoadingOn(false);
      this.openSnackBar('Dane zapisane.');
    }, 450);
  }

  private updateEntryLabelToAllMonths(payload: fromModels.UpadatePayload): void {
    const entry: string = payload.entry;
    const label: string = payload.label;

    let path: string = this.currentEntries.path;
    this.months.forEach((month: fromModels.DataLabel) => {
      path = path.replace(month.key, 'month');
    });

    this.months.forEach((month: fromModels.DataLabel) => {
      const replacedPath: string = path.replace('month', month.key);
      const updatedPayload: fromModels.UpadatePayload = {
        entry,
        label,
        path: replacedPath,
      };
      this.updateEntryLabel(updatedPayload);
    });
  }

  private updateEntryLabel(payload: fromModels.UpadatePayload): void {
    this.budgetsHttpService.updateEntryLabel(payload)
      .pipe(take(1))
      .subscribe();
  }

  private updateEntry(payload: fromModels.UpadatePayload): void {
    this.budgetsHttpService.updateEntry(payload)
      .pipe(take(1))
      .subscribe(() => this.handleAfterUpdateEntry(payload));
  }

  private handleAfterUpdateEntry(payload: fromModels.UpadatePayload): void {
    this.updateParentTotals(payload.path);
    this.updateEntryLabelToAllMonths(payload);

    setTimeout(() => {
      this.goToDetails(this.parentPlanEntry);
      this.setIsLoadingOn(false);
      this.openSnackBar('Dane zapisane.');
    }, 450);
  }

  private updateParentTotals(path: string): void {
    let newPath: string[] = path.split('/');
    const len: number = ((newPath.length - 6));
    const subs$ = [];
    for (let i = 0; i < len; i++) {
      newPath = newPath.slice(0, -1);

      if (newPath[newPath.length - 1] !== 'entries') {
        const formedPath = newPath.join('/').split('/').slice(0, -1).join('/');
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
                    path: formedPath,
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
    this.budgetsHttpService.updateParentEntry(payload)
      .pipe(take(1))
      .subscribe();
  }

  private setDisplayedColumns(): void {
    this.displayedColumns = [];
    this.displayedColumns.push(fromEnums.DataProperty.month);
    this.displayedColumns.push(fromEnums.DataProperty.total);
    this.displayedColumns = this.displayedColumns.concat([
      ...new Set(this.dataColumns),
    ]);
  }

  private formDataColumns(formedLabels: fromModels.DataLabel[]): void {
    this.dataColumns = [];
    this.dataColumns = formedLabels.map((label: fromModels.DataLabel) => label.key);
  }

  private formDataLabels(formedLabels: fromModels.DataLabel[]): void {
    this.dataLabels = Object.assign(
      this.dataLabels,
      ...formedLabels.map((item) => ({ [item.key]: item.value }))
    );
  }

  private setIsLoadingOn(isOn: boolean): void {
    this.isLoadingOn = isOn;
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, 'Zamknij', { duration: 5000 });
  }
}
