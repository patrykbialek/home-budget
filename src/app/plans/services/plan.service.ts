import { combineLatest, forkJoin, Observable, Subject } from 'rxjs';

import { Injectable } from '@angular/core';
import { PlanHttpService } from './plan-http.service';
import { delay, filter, take, takeUntil, tap } from 'rxjs/operators';
import { DataProperty } from '../plans.enum';
import { Router } from '@angular/router';
import { DataLabels, DataLabel, DataSourceDetails, PlanEntry } from '../plans.model';
import { BreadcrumbsService } from './breadcrumbs.service';
import { labels, monthLabel, planType } from '../plans.config';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PlanDetailsFormComponent } from '../components';

const commonLabels: string[] = ['month', 'monthId', 'order', 'path', 'total'];

@Injectable({ providedIn: 'root' })
export class PlanService {
  public dataColumns: string[];
  public dataLabels: DataLabels = {
    execution: 'Wykonanie',
    expenses: 'Wydatki',
    incomes: 'Przychody',
    increase: 'Przyrost',
    month: 'Miesiąc',
    project: 'Projekt',
    rest: 'Reszta',
    total: 'Razem',
  };
  public dataSource: DataSourceDetails[] = [];
  public defaultDataSource: DataSourceDetails[] = [];
  public displayedColumns: string[] = [];
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
    return this.planHttpService.months;
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
      .filter((entry: any) => {
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
    this.defaultDataSource = [
      { month: 'jan', total: 0 },
      { month: 'feb', total: 0 },
      { month: 'mar', total: 0 },
      { month: 'apr', total: 0 },
      { month: 'may', total: 0 },
      { month: 'jun', total: 0 },
      { month: 'jul', total: 0 },
      { month: 'aug', total: 0 },
      { month: 'sep', total: 0 },
      { month: 'oct', total: 0 },
      { month: 'nov', total: 0 },
      { month: 'dec', total: 0 },
    ];
  }

  public editPlanEntry(planEntry: PlanEntry): void {
    const form: FormGroup = this.setFormData(planEntry);
    this.openDialog(form, planEntry);
  }

  public goToDetails(planEntry: PlanEntry): void {
    this.parentPlanEntry = planEntry;

    if (planEntry.isCurrent) {
      return;
    }

    if (planEntry.href) {
      this.router.navigate([planEntry.href]);
      return;
    }

    const sourcePath: string = `${planEntry.path}`;
    const months: DataLabel[] = this.months;
    const subs$: Observable<any>[] = [];
    if (planEntry.hasEntries) {
      this.breadcrumbsService.formBreadcrumbs(planEntry, this.dataLabels);

      const dataSource: DataSourceDetails[] = [];
      let path: string = sourcePath;
      months.forEach((month: DataLabel) => {
        path = path.replace(month.key, 'month');
        this.parentPlanEntry = {
          ...this.parentPlanEntry,
          path: this.parentPlanEntry.path.replace(month.key, 'month'),
        };
      });

      months.forEach((month: DataLabel, index: number) => {
        const replacedPath = path.replace('month', month.key);
        subs$.push(this.readDataByType(replacedPath)
          .pipe(
            tap((entries: any[]) => {
              planEntry = {
                ...planEntry,
                month: month.key,
              };
              const foundEntry: any = entries.find(entry => entry.key === planEntry.entry);
              let dataItem: DataSourceDetails = {
                month: month.key,
                order: index,
                path: `${replacedPath}/${planEntry.entry}/entries`,
                total: foundEntry.total,
              };

              let total: number = 0;
              Object.keys(foundEntry.entries)
                .forEach((key: string) => {
                  total += foundEntry.entries[key].total;
                  console.log(foundEntry)
                  dataItem = {
                    ...dataItem,
                    [key]: {
                      label: foundEntry.entries[key].label,
                      notes: foundEntry.entries[key].notes,
                      total: foundEntry.entries[key].total,
                      hasEntries: Boolean(foundEntry.entries[key].entries),
                    },
                  };
                });

              dataItem = {
                ...dataItem,
                parentPath: `${replacedPath}`,
                total,
              };

              dataSource.push(dataItem);
            }))
        );
      });

      combineLatest(subs$)
        .pipe(take(1))
        .subscribe(() => {
          this.dataSource = [...new Set(dataSource)];
          dataSource.length = 0;
          this.dataColumns = [];
          this.displayedColumns = [];
          this.setDataLabelsAndColumns(this.dataSource[0]);
          this.dataColumns = this.dataColumns.filter((dataColumn: string) => dataColumn !== 'hasEntries');
          this.setDisplayedColumns();

          console.log(this.dataSource);
        });
    }
  }

  public openDialog(form: FormGroup, planEntry: PlanEntry): void {
    const dialogRef = this.dialog.open(PlanDetailsFormComponent, {
      data: { form, dataLabels: this.dataLabels },
    });

    dialogRef.afterClosed()
      .pipe(filter((result: { form: FormGroup; }) => Boolean(result)))
      .subscribe((result: { form: FormGroup; }) => {
        const { total, path, entry, notes } = result.form.value;
        this.updateEntry(total, path, entry, notes, planEntry);
      });
  }

  private updateEntry(total: number, path: string, entry: string, notes: string, planEntry: PlanEntry): void {
    this.planHttpService.updateEntry(total, path, entry, notes)
      .pipe(take(1))
      .subscribe(() => {
        setTimeout(() => {
          this.goToDetails(this.parentPlanEntry);
        });
        this.updateParentTotals(path);
      });
  }

  private updateParentTotals(path: string): void {
    let newPath: any[] = path.split('/');
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
              tap((response: any) => {
                if (response.key !== 'entries') {
                  let total = 0;
                  const entries = response.value.entries;
                  Object.keys(entries)
                    .forEach((entryKey: string) => {
                      total += entries[entryKey].total;
                    });
                  this.updateParentEntry(total, path, response.key);
                }
              })
            )
        );
      }
    }
    forkJoin(subs$).subscribe();
  }

  private updateParentEntry(total: number, path: string, entry: string): void {
    this.planHttpService.updateEntry(total, path, entry)
      .pipe(take(1)).subscribe();
  }

  private setDisplayedColumns(): void {
    this.displayedColumns.push(DataProperty.month);
    this.displayedColumns.push(DataProperty.total);
    this.displayedColumns = this.displayedColumns.concat([
      ...new Set(this.dataColumns),
    ]);
  }

  private setDataColumns(labels: DataLabel[]): void {
    this.dataColumns = labels.map((label: DataLabel) => label.key);
  }

  private setDataLabels(labels: DataLabel[]): void {
    this.dataLabels = Object.assign(
      this.dataLabels,
      ...labels.map((item) => ({ [item.key]: item.value }))
    );
  }

  public form: FormGroup;

  private setFormData(planEntry: PlanEntry): FormGroup {
    const form: FormGroup = new FormGroup({
      entry: new FormControl(planEntry.entry),
      month: new FormControl(planEntry.month),
      notes: new FormControl(planEntry.notes),
      path: new FormControl(planEntry.path),
      total: new FormControl(planEntry.total),
    });
    return form;
  }

}
