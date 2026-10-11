import { FormGroup } from '@angular/forms';
import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import * as _ from 'lodash';
import { filter, switchMap, take, tap } from 'rxjs/operators';
import { forkJoin, Observable, Subscription } from 'rxjs';

import { BreadcrumbsItem } from '../models/finance-breadcrumbs.model';
import { CoreService } from '@home-budget/core/core.service';
import { DataItem, DataLabel, DataLabels, DataSourceDetails, DataSourceSummary, FinanceEntry, MonthLabel, UpdatePayload } from '@home-budget/finance/models';
import { dataLabels, defaultDataSource, labels, monthLabel, months } from '../shared/finance.config';
import { DataProperty } from '../models/finance.enum';
import { FINANCE_FEATURE_CONFIG } from '@home-budget/finance/finance-feature.config';
import { FinanceAddColumnFormComponent, FinanceEditFormComponent } from '../components';
import { FinanceBreadcrumbsService } from './finance-breadcrumbs.service';
import { FinanceFormService } from './finance-form.service';
import { FinanceHttpService } from './finance-http.service';
import { formatNumber, formData, formDataFooter, formLabels, formPathForDeleteEntry } from './finance-details-former.utils';

@Injectable()
export class FinanceService {
  dialog = inject(MatDialog);
  private readonly coreService = inject(CoreService);
  private readonly financeBreadcrumbsService = inject(FinanceBreadcrumbsService);
  private readonly financeFormService = inject(FinanceFormService);
  private readonly financeHttpService = inject(FinanceHttpService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly collection = inject(FINANCE_FEATURE_CONFIG).collection;

  dataColumns!: string[];
  dataLabels: DataLabels = dataLabels;
  dataSource: DataSourceDetails[] = [];
  dataSourceFooter!: DataSourceDetails;
  defaultDataSource: DataSourceSummary[] = defaultDataSource;
  displayedColumns: string[] = [];
  form!: FormGroup;

  private isLoadingOn: boolean = false;
  private parentFinanceEntry!: FinanceEntry;
  private dataSubscription: Subscription | undefined;

  get months(): DataLabel[] {
    return months;
  }

  get labels(): DataLabel[] {
    return labels;
  }

  get isLoading(): boolean {
    return this.isLoadingOn;
  }

  get currentEntries(): BreadcrumbsItem {
    return this.financeBreadcrumbsService.breadcrumbs
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
    return this.financeHttpService.readData(this.collection, sourcePath, uid);
  }

  readDataByTypeObject(sourcePath: string): Observable<unknown> {
    return this.financeHttpService.readDataByTypeObject(this.collection, sourcePath);
  }

  readDataByType(sourcePath: string): Observable<unknown> {
    return this.financeHttpService.readDataByType(this.collection, sourcePath);
  }

  private formDataLabelsAndColumns(data: DataSourceDetails): void {
    this.formDataColumns(formLabels(data));
    this.formDataLabels(formLabels(data));
  }

  private setDataLabel(label: DataLabel): void {
    this.dataLabels = {
      ...this.dataLabels,
      [label.key]: label.value,
    };
  }

  setCommonDataLabels(): void {
    Object.keys(monthLabel).forEach((key: string) => {
      this.setDataLabel({
        key: monthLabel[key as keyof MonthLabel].id,
        value: monthLabel[key as keyof MonthLabel].long,
      });
    });

    this.labels.forEach((label: DataLabel) => {
      this.setDataLabel(label);
    });
  }

  editFinanceEntry(financeEntry: FinanceEntry): void {
    const form: FormGroup = this.financeFormService.buildEditForm(financeEntry);
    this.editDetails(form);
  }

  addFinanceEntryColumn(): void {
    const form: FormGroup = this.financeFormService.buildAddColumnForm();
    this.addColumn(form);
  }

  goToDetails(financeEntry: FinanceEntry): void {
    if (financeEntry.href) {
      this.router.navigate([financeEntry.href]);
      return;
    }

    this.formBreadcrumbs(financeEntry);
    this.subscribeToReadData(financeEntry);
    this.parentFinanceEntry = financeEntry;
  }

  private editDetails(form: FormGroup): void {
    const dialogRef: MatDialogRef<FinanceEditFormComponent> = this.dialog.open(FinanceEditFormComponent, {
      data: { form, dataLabels: this.dataLabels },
      position: { top: '64px' },
      width: '400px',
    });

    dialogRef.afterClosed()
      .pipe(filter((callback: { form: FormGroup; isToDelete: boolean; }) => Boolean(callback)))
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
    const dialogRef = this.dialog.open(FinanceAddColumnFormComponent, {
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

  private formBreadcrumbs(financeEntry: FinanceEntry): void {
    this.financeBreadcrumbsService.formBreadcrumbs(financeEntry, this.dataLabels);
  }

  private subscribeToReadData(financeEntry: FinanceEntry): void {
    this.dataSubscription?.unsubscribe();
    this.dataSubscription = this.coreService.year$
      .pipe(
        switchMap((year: string) => this.readData(`${year}/entries`)),
        tap((data: DataItem[]) => {
          this.formDataSource(financeEntry, data);
          this.formDataSourceFooter();
          this.formDataLabelsAndColumns(this.dataSource[0]);
          this.setDisplayedColumns();
        })
      )
      .subscribe();
  }

  private formDataSource(financeEntry: FinanceEntry, data: DataItem[]): void {
    this.dataSource = formData(financeEntry, data);
  }

  private formDataSourceFooter(): void {
    this.dataSourceFooter = formDataFooter(this.dataSource);
  }

  private deleteEntry(path: string, entry: FinanceEntry): void {
    const updatedPath: string = formPathForDeleteEntry(path, entry);
    const subs$: Observable<any>[] = [];
    this.months.forEach((month: DataLabel) => {
      const replacedPath: string = updatedPath.replace('month', month.key);
      subs$.push(this.financeHttpService.deleteEntry(this.collection, replacedPath));
    });

    forkJoin(subs$)
      .subscribe({
        next: () => this.handleAfterDeleteEntry(),
        error: () => this.handleWriteError(),
      });
  }

  private handleAfterDeleteEntry(): void {
    this.goToDetails(this.parentFinanceEntry);
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
    let path: string = this.currentEntries.path ?? '';
    const entry: string = this.currentEntries.entry;
    const subs$: Observable<any>[] = [];

    let payload: Record<string, unknown> = {
      isInTotal: true,
      label: form.value.label,
      notes: null,
      order: form.value.order,
      total: 0,
    };

    this.months.forEach((month: DataLabel) => {
      path = path.replace(month.key, 'month');
    });

    this.months.forEach((month: DataLabel) => {
      const replacedPath = path.replace('month', month.key);
      subs$.push(this.financeHttpService.readEntriesObject(this.collection, replacedPath)
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

            return this.financeHttpService.updateEntriesObject(this.collection, replacedPath, entries);
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

  private updateEntryLabelToAllMonths(payload: UpdatePayload): void {
    const entry: string = payload.entry;
    const label: string = payload.label ?? '';

    let path: string = this.currentEntries.path ?? '';
    this.months.forEach((month: DataLabel) => {
      path = path.replace(month.key, 'month');
    });

    this.months.forEach((month: DataLabel) => {
      const replacedPath: string = path.replace('month', month.key);
      const updatedPayload: UpdatePayload = {
        entry,
        label,
        path: replacedPath,
      };
      this.updateEntryLabel(updatedPayload);
    });
  }

  private updateEntryLabel(payload: UpdatePayload): void {
    this.financeHttpService.updateEntryLabel(this.collection, payload)
      .pipe(take(1))
      .subscribe();
  }

  private updateEntry(payload: UpdatePayload): void {
    this.financeHttpService.updateEntry(this.collection, payload)
      .pipe(take(1))
      .subscribe({
        next: () => this.handleAfterUpdateEntry(payload),
        error: () => this.handleWriteError(),
      });
  }

  private handleAfterUpdateEntry(payload: UpdatePayload): void {
    this.updateParentTotals(payload.path);
    this.updateEntryLabelToAllMonths(payload);

    this.goToDetails(this.parentFinanceEntry);
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

                  const updatePayload: UpdatePayload = {
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

  private updateParentEntry(payload: UpdatePayload): void {
    this.financeHttpService.updateParentEntry(this.collection, payload)
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

  private formDataColumns(formedLabels: DataLabel[]): void {
    this.dataColumns = [];
    this.dataColumns = formedLabels.map((label: DataLabel) => label.key);
  }

  private formDataLabels(formedLabels: DataLabel[]): void {
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
