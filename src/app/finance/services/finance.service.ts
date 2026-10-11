import { FormGroup } from '@angular/forms';
import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { filter, switchMap, tap } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

import { BreadcrumbsItem } from '../models/finance-breadcrumbs.model';
import { CoreService } from '@home-budget/core/core.service';
import { DataItem, DataLabel, DataLabels, DataSourceDetails, DataSourceSummary, FinanceEntry, MonthLabel } from '@home-budget/finance/models';
import { dataLabels, defaultDataSource, labels, monthLabel, months } from '../shared/finance.config';
import { DataProperty } from '../models/finance.enum';
import { FINANCE_FEATURE_CONFIG } from '@home-budget/finance/finance-feature.config';
import { FinanceAddColumnFormComponent, FinanceEditFormComponent } from '../components';
import { FinanceBreadcrumbsService } from './finance-breadcrumbs.service';
import { FinanceFormService } from './finance-form.service';
import { FinanceHttpService } from './finance-http.service';
import { FinanceWriteService } from './finance-write.service';
import { formData, formDataFooter, formLabels } from './finance-details-former.utils';

@Injectable()
export class FinanceService {
  dialog = inject(MatDialog);
  private readonly coreService = inject(CoreService);
  private readonly financeBreadcrumbsService = inject(FinanceBreadcrumbsService);
  private readonly financeFormService = inject(FinanceFormService);
  private readonly financeHttpService = inject(FinanceHttpService);
  private readonly financeWriteService = inject(FinanceWriteService);
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

  private withCurrentYear(path: string): string {
    const segments: string[] = path.split('/');
    segments[0] = this.coreService.year;
    return segments.join('/');
  }

  readData(sourcePath: string, uid?: string): Observable<any> {
    return this.financeHttpService.readData(this.collection, sourcePath, uid);
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

    const write$ = isToDelete
      ? this.financeWriteService.deleteEntry(path, entry)
      : this.financeWriteService.updateEntry({ entry, isInTotal, label, notes, order, path, total }, this.currentEntries.path ?? '');

    write$.subscribe({
      next: () => this.handleAfterWrite(true),
      error: () => this.handleWriteError(),
    });
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
    this.financeWriteService.addColumn(form, this.currentEntries)
      .subscribe({
        next: () => this.handleAfterWrite(false),
        error: () => this.handleWriteError(),
      });
  }

  private handleAfterWrite(reload: boolean): void {
    if (reload) {
      this.goToDetails(this.parentFinanceEntry);
    }
    this.setIsLoadingOn(false);
    this.openSnackBar('Dane zapisane.');
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
