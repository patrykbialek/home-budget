import { forkJoin, Observable, Subscription } from 'rxjs';

import { BreadcrumbsItem } from '../models/plan-breadcrumbs.model';
import { dataLabels, defaultDataSource, labels, monthLabel, months } from '../shared/plans.config';
import { DataProperty } from '../models/plans.enum';
import { filter, switchMap, take, tap } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PlanAddColumnFormComponent, PlanEditFormComponent } from '../components';
import { PlansBreadcrumbsService } from './plans-breadcrumbs.service';
import { PlansHttpService } from './plans-http.service';
import { Router } from '@angular/router';

import { PlansFormService } from './plans-form.service';

import * as _ from 'lodash';
import * as fromModels from '@home-budget/plans/models';
import { MatSnackBar } from '@angular/material/snack-bar';

import { formatdNumber, formData, formDataFooter, formLabels, formPathForDeleteEntry } from './plan-details-former.utils';
import { CoreService } from '@home-budget/core/core.service';

@Injectable({ providedIn: 'root' })
export class PlansService {
  dialog = inject(MatDialog);
  private readonly coreService = inject(CoreService);
  private readonly plansBreadcrumbsService = inject(PlansBreadcrumbsService);
  private readonly plansFormService = inject(PlansFormService);
  private readonly plansHttpService = inject(PlansHttpService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  dataColumns: string[];
  dataLabels: fromModels.DataLabels = dataLabels;
  dataSource: fromModels.DataSourceDetails[] = [];
  dataSourceFooter: fromModels.DataSourceDetails;
  defaultDataSource: fromModels.DataSourceSummary[] = defaultDataSource;
  displayedColumns: string[] = [];
  form: FormGroup;

  private isLoadingOn: boolean = false;
  private parentPlanEntry: fromModels.PlanEntry;
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
    return this.plansBreadcrumbsService.breadcrumbs
      .filter((breadcrumb: BreadcrumbsItem) => breadcrumb.isCurrent)
      .map((breadcrumb: BreadcrumbsItem) => {
        return {
          entry: breadcrumb.entry,
          path: `${breadcrumb.path}/${breadcrumb.entry}/entries`,
        };
      })[0];
  }

  readData(sourcePath: string, uid?: string): Observable<any> {
    return this.plansHttpService.readData(sourcePath, uid);
  }

  readDataByTypeObject(sourcePath: string): Observable<unknown> {
    return this.plansHttpService.readDataByTypeObject(sourcePath);
  }

  readDataByType(sourcePath: string): Observable<unknown> {
    return this.plansHttpService.readDataByType(sourcePath);
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

  setCommonDataLables(): void {
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

  editPlanEntry(planEntry: fromModels.PlanEntry): void {
    const form: FormGroup = this.plansFormService.buildEditForm(planEntry);
    this.editDetails(form);
  }

  addPlanEntryColumn(): void {
    const form: FormGroup = this.plansFormService.buildAddColumnForm();
    this.addColumn(form);
  }

  goToDetails(planEntry: fromModels.PlanEntry): void {
    if (planEntry.href) {
      this.router.navigate([planEntry.href]);
      return;
    }

    this.formBreadcrumbs(planEntry);
    this.subscribeToReadData(planEntry);
    this.parentPlanEntry = planEntry;
  }

  private editDetails(form: FormGroup): void {
    const dialogRef: MatDialogRef<PlanEditFormComponent> = this.dialog.open(PlanEditFormComponent, {
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
    const { entry, isInTotal, label, notes, order, path, total } = form.value;
    this.setIsLoadingOn(true);
    if (isToDelete) {
      this.deleteEntry(path, entry);
      return;
    }
    this.updateEntry({ entry, isInTotal, label, notes, order, path, total });
  }

  private addColumn(form: FormGroup): void {
    const dialogRef = this.dialog.open(PlanAddColumnFormComponent, {
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

  private formBreadcrumbs(planEntry: fromModels.PlanEntry): void {
    this.plansBreadcrumbsService.formBreadcrumbs(planEntry, this.dataLabels);
  }

  private subscribeToReadData(planEntry: fromModels.PlanEntry): void {
    this.dataSubscription?.unsubscribe();
    this.dataSubscription = this.coreService.year$
      .pipe(
        switchMap((year: string) => this.readData(`${year}/entries`)),
        tap((data: fromModels.DataItem[]) => {
          this.formDataSource(planEntry, data);
          this.formDataSourceFooter();
          this.formDataLabelsAndColumns(this.dataSource[0]);
          this.setDisplayedColumns();
        })
      )
      .subscribe();
  }

  private formDataSource(planEntry: fromModels.PlanEntry, data: fromModels.DataItem[]): void {
    this.dataSource = formData(planEntry, data);
  }

  private formDataSourceFooter(): void {
    this.dataSourceFooter = formDataFooter(this.dataSource);
  }

  private deleteEntry(path: string, entry: fromModels.PlanEntry): void {
    const updatedPath: string = formPathForDeleteEntry(path, entry);
    const subs$: Observable<any>[] = [];
    this.months.forEach((month: fromModels.DataLabel) => {
      const replacedPath: string = updatedPath.replace('month', month.key);
      subs$.push(this.plansHttpService.deleteEntry(replacedPath));
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
      subs$.push(this.plansHttpService.readEntriesObject(replacedPath)
        .pipe(
          take(1),
          tap((raw) => {
            let entries = raw as Record<string, unknown>;
            const lastIndex: number = Object.keys(entries).length + 1;
            const key: string = `${entry}${formatdNumber(lastIndex)}`;

            if (form.value.hasEntries) {
              const childKey: string = `${key}${formatdNumber(1)}`;
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

            this.plansHttpService.updateEntriesObject(replacedPath, entries);
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
    this.plansHttpService.updateEntryLabel(payload)
      .pipe(take(1))
      .subscribe();
  }

  private updateEntry(payload: fromModels.UpadatePayload): void {
    this.plansHttpService.updateEntry(payload)
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

                  const updatePayload: fromModels.UpadatePayload = {
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
