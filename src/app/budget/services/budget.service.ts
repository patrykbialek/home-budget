import { forkJoin, Observable, Subscription } from 'rxjs';

import { BreadcrumbsItem } from '../models/budget-breadcrumbs.model';
import { dataLabels, defaultDataSource, labels, monthLabel, months } from '../shared/budget.config';
import { DataProperty } from '../models/budget.enum';
import { filter, switchMap, take, tap } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BudgetAddColumnFormComponent, BudgetEditFormComponent } from '../components';
import { BudgetBreadcrumbsService } from './budget-breadcrumbs.service';
import { BudgetHttpService } from './budget-http.service';
import { Router } from '@angular/router';

import { BudgetFormService } from './budget-form.service';

import * as _ from 'lodash';
import * as fromModels from '@home-budget/budget/models';
import { MatSnackBar } from '@angular/material/snack-bar';

import { formatNumber, formData, formDataFooter, formLabels, formPathForDeleteEntry } from './budget-details-former.utils';
import { CoreService } from '@home-budget/core/core.service';
import { BUDGET_FEATURE_CONFIG } from '@home-budget/budget/budget-feature.config';

@Injectable()
export class BudgetService {
  dialog = inject(MatDialog);
  private readonly coreService = inject(CoreService);
  private readonly budgetBreadcrumbsService = inject(BudgetBreadcrumbsService);
  private readonly budgetFormService = inject(BudgetFormService);
  private readonly budgetHttpService = inject(BudgetHttpService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly collection = inject(BUDGET_FEATURE_CONFIG).collection;

  dataColumns: string[];
  dataLabels: fromModels.DataLabels = dataLabels;
  dataSource: fromModels.DataSourceDetails[] = [];
  dataSourceFooter: fromModels.DataSourceDetails;
  defaultDataSource: fromModels.DataSourceSummary[] = defaultDataSource;
  displayedColumns: string[] = [];
  form: FormGroup;

  private isLoadingOn: boolean = false;
  private parentBudgetEntry: fromModels.BudgetEntry;
  private dataSubscription: Subscription | undefined;

  get months(): fromModels.DataLabel[] {
    return months;
  }

  get labels(): fromModels.DataLabel[] {
    return labels;
  }

  get isLoading(): boolean {
    return this.isLoadingOn;
  }

  get currentEntries(): BreadcrumbsItem {
    return this.budgetBreadcrumbsService.breadcrumbs
      .filter((breadcrumb: BreadcrumbsItem) => breadcrumb.isCurrent)
      .map((breadcrumb: BreadcrumbsItem) => {
        return {
          entry: breadcrumb.entry,
          path: this.withCurrentYear(`${breadcrumb.path}/${breadcrumb.entry}/entries`),
        };
      })[0];
  }

  // NOTE: data paths carry the year as their first segment; it is captured when
  // entering the details view. When the year is switched (header) while staying
  // on details, the write path must follow the current (URL) year, not the stale one.
  private withCurrentYear(path: string): string {
    const segments: string[] = path.split('/');
    segments[0] = this.coreService.year;
    return segments.join('/');
  }

  readData(sourcePath: string, uid?: string): Observable<any> {
    return this.budgetHttpService.readData(this.collection, sourcePath, uid);
  }

  readDataByTypeObject(sourcePath: string): Observable<unknown> {
    return this.budgetHttpService.readDataByTypeObject(this.collection, sourcePath);
  }

  readDataByType(sourcePath: string): Observable<unknown> {
    return this.budgetHttpService.readDataByType(this.collection, sourcePath);
  }

  private formDataLabelsAndColumns(data: fromModels.DataSourceDetails): void {
    this.formDataColumns(formLabels(data));
    this.formDataLabels(formLabels(data));
  }

  private setDataLabel(label: fromModels.DataLabel): void {
    this.dataLabels = {
      ...this.dataLabels,
      [label.key]: label.value,
    };
  }

  setCommonDataLabels(): void {
    Object.keys(monthLabel).forEach((key: string) => {
      this.setDataLabel({
        key: monthLabel[key].id,
        value: monthLabel[key].long,
      });
    });

    this.labels.forEach((label: fromModels.DataLabel) => {
      this.setDataLabel(label);
    });
  }

  editBudgetEntry(budgetEntry: fromModels.BudgetEntry): void {
    const form: FormGroup = this.budgetFormService.buildEditForm(budgetEntry);
    this.editDetails(form);
  }

  addBudgetEntryColumn(): void {
    const form: FormGroup = this.budgetFormService.buildAddColumnForm();
    this.addColumn(form);
  }

  goToDetails(budgetEntry: fromModels.BudgetEntry): void {
    if (budgetEntry.href) {
      this.router.navigate([budgetEntry.href]);
      return;
    }

    this.formBreadcrumbs(budgetEntry);
    this.subscribeToReadData(budgetEntry);
    this.parentBudgetEntry = budgetEntry;
  }

  private editDetails(form: FormGroup): void {
    const dialogRef: MatDialogRef<BudgetEditFormComponent> = this.dialog.open(BudgetEditFormComponent, {
      data: { form, dataLabels: this.dataLabels },
      position: { top: '64px' },
      width: '400px',
    });

    dialogRef.afterClosed()
      .pipe(filter((callback: { form: FormGroup; }) => Boolean(callback)))
      .subscribe((callback: { form: FormGroup; isToDelete: boolean; }) => {
        this.handleAfterEditDialogClose(callback.form, callback.isToDelete);
      });
  }

  private handleAfterEditDialogClose(form: FormGroup, isToDelete: boolean): void {
    const { entry, isInTotal, label, notes, order, total } = form.value;
    const path: string = this.withCurrentYear(form.value.path);
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
      width: '400px',
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

  private formBreadcrumbs(budgetEntry: fromModels.BudgetEntry): void {
    this.budgetBreadcrumbsService.formBreadcrumbs(budgetEntry, this.dataLabels);
  }

  private subscribeToReadData(budgetEntry: fromModels.BudgetEntry): void {
    this.dataSubscription?.unsubscribe();
    this.dataSubscription = this.coreService.year$
      .pipe(
        switchMap((year: string) => this.readData(`${year}/entries`)),
        tap((data: fromModels.DataItem[]) => {
          this.formDataSource(budgetEntry, data);
          this.formDataSourceFooter();
          this.formDataLabelsAndColumns(this.dataSource[0]);
          this.setDisplayedColumns();
        })
      )
      .subscribe();
  }

  private formDataSource(budgetEntry: fromModels.BudgetEntry, data: fromModels.DataItem[]): void {
    this.dataSource = formData(budgetEntry, data);
  }

  private formDataSourceFooter(): void {
    this.dataSourceFooter = formDataFooter(this.dataSource);
  }

  private deleteEntry(path: string, entry: fromModels.BudgetEntry): void {
    const updatedPath: string = formPathForDeleteEntry(path, entry);
    const subs$: Observable<any>[] = [];
    this.months.forEach((month: fromModels.DataLabel) => {
      const replacedPath: string = updatedPath.replace('month', month.key);
      subs$.push(this.budgetHttpService.deleteEntry(this.collection, replacedPath));
    });

    forkJoin(subs$)
      .subscribe({
        next: () => this.handleAfterDeleteEntry(),
        error: () => this.handleWriteError(),
      });
  }

  private handleAfterDeleteEntry(): void {
    this.goToDetails(this.parentBudgetEntry);
    this.setIsLoadingOn(false);
    this.openSnackBar('Dane zapisane.');
  }

  // NOTE: new column keys are `${entry}NN`; derive the next index from the
  // highest existing suffix (not the count) so a key is not reused after a
  // column in the middle has been deleted.
  private nextEntryIndex(entries: Record<string, unknown>, entry: string): number {
    const indices: number[] = Object.keys(entries)
      .filter((key: string) => key.startsWith(entry))
      .map((key: string) => Number(key.slice(entry.length)))
      .filter((index: number) => Number.isInteger(index));
    return (indices.length ? Math.max(...indices) : 0) + 1;
  }

  private addColumnToAllMonths(form: FormGroup): void {
    let path: string = this.currentEntries.path;
    const entry: string = this.currentEntries.entry;
    const subs$: Observable<any>[] = [];

    let payload: Record<string, unknown> = {
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
      subs$.push(this.budgetHttpService.readEntriesObject(this.collection, replacedPath)
        .pipe(
          take(1),
          switchMap((raw) => {
            let entries = raw as Record<string, unknown>;
            const lastIndex: number = this.nextEntryIndex(entries, entry);
            const key: string = `${entry}${formatNumber(lastIndex)}`;

            if (form.value.hasEntries) {
              const childKey: string = `${key}${formatNumber(1)}`;
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

            return this.budgetHttpService.updateEntriesObject(this.collection, replacedPath, entries);
          }))
      );
    });

    forkJoin(subs$)
      .subscribe({
        next: () => this.handleAfterAddColumnToAllMonths(),
        error: () => this.handleWriteError(),
      });
  }

  private handleAfterAddColumnToAllMonths(): void {
    this.setIsLoadingOn(false);
    this.openSnackBar('Dane zapisane.');
  }

  private updateEntryLabelToAllMonths(payload: fromModels.UpdatePayload): void {
    const entry: string = payload.entry;
    const label: string = payload.label;

    let path: string = this.currentEntries.path;
    this.months.forEach((month: fromModels.DataLabel) => {
      path = path.replace(month.key, 'month');
    });

    this.months.forEach((month: fromModels.DataLabel) => {
      const replacedPath: string = path.replace('month', month.key);
      const updatedPayload: fromModels.UpdatePayload = {
        entry,
        label,
        path: replacedPath,
      };
      this.updateEntryLabel(updatedPayload);
    });
  }

  private updateEntryLabel(payload: fromModels.UpdatePayload): void {
    this.budgetHttpService.updateEntryLabel(this.collection, payload)
      .pipe(take(1))
      .subscribe();
  }

  private updateEntry(payload: fromModels.UpdatePayload): void {
    this.budgetHttpService.updateEntry(this.collection, payload)
      .pipe(take(1))
      .subscribe({
        next: () => this.handleAfterUpdateEntry(payload),
        error: () => this.handleWriteError(),
      });
  }

  private handleAfterUpdateEntry(payload: fromModels.UpdatePayload): void {
    this.updateParentTotals(payload.path);
    this.updateEntryLabelToAllMonths(payload);

    this.goToDetails(this.parentBudgetEntry);
    this.setIsLoadingOn(false);
    this.openSnackBar('Dane zapisane.');
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
              tap((response) => {
                const item = response as { key: string | null; value: { entries?: Record<string, { isInTotal: boolean; total: number }> } };
                if (item.key !== 'entries') {
                  let total: number = 0;
                  const entries = item.value?.entries ?? {};
                  Object.keys(entries)
                    .forEach((entryKey: string) => {
                      if (entries[entryKey].isInTotal) {
                        total += entries[entryKey].total;
                      }
                    });

                  const updatePayload: fromModels.UpdatePayload = {
                    path: formedPath,
                    entry: item.key ?? '',
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

  private updateParentEntry(payload: fromModels.UpdatePayload): void {
    this.budgetHttpService.updateParentEntry(this.collection, payload)
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

  private handleWriteError(): void {
    this.setIsLoadingOn(false);
    this.openSnackBar('Nie udało się zapisać danych.');
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, 'Zamknij', { duration: 5000 });
  }
}
