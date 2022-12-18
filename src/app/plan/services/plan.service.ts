import { combineLatest, Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { PlanHttpService } from './plan-http.service';
import { tap } from 'rxjs/operators';
import { DataProperty } from '../plan.enum';
import { Router } from '@angular/router';
import { DataLabels, DataLabel } from '../plan.model';
import { BreadcrumbsService } from './breadcrumbs.service';

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
  public defaultDataSource: any[] = [];

  private readonly main: string = 'plan';

  constructor(
    private readonly breadcrumbsService: BreadcrumbsService,
    private readonly planHttpService: PlanHttpService,
    private readonly router: Router,
  ) { }

  public get months(): any[] {
    return this.planHttpService.months;
  }

  public readData(sourcePath: string): Observable<any> {
    return this.planHttpService.readData(sourcePath);
  }

  public readDataByType(sourcePath: string): Observable<any> {
    return this.planHttpService.readDataByType(sourcePath);
  }

  public getDataItem(path: string): any {
    let data = JSON.parse(localStorage.getItem(this.main))['2023'];
    for (let i = 0, paths = path.split('.'), len = paths.length; i < len; i++) {
      data = data[paths[i]];
    }
    return data;
  }

  public setDataLabelsAndColumns(data: any): void {
    const labels: DataLabel[] = Object.keys(data)
      .map((dataItem: string) => {
        return {
          key: dataItem,
          order: data[dataItem].order,
          value: <string>data[dataItem].label,
        };
      })
      .sort((first: any, last: any) => first.order - last.order)
      .filter((entry: any) => {
        return !commonLabels.includes(entry.key);
      })
      .map((entry: any) => entry);

    this.setDataColumns(labels);
    this.setDataLabels(labels);
  }

  public setDataLabel(label: DataLabel): void {
    this.dataLabels = {
      ...this.dataLabels,
      [label.key]: label.value,
    }
  }

  public setCommonDataLables(): void {
    this.setDataLabel({ key: 'execution', value: 'Wykonanie' });
    this.setDataLabel({ key: 'expenses', value: 'Wydatki' });
    this.setDataLabel({ key: 'incomes', value: 'Przychody' });
    this.setDataLabel({ key: 'month', value: 'Miesiąc' });
    this.setDataLabel({ key: 'project', value: 'Projekt' });
    this.setDataLabel({ key: 'total', value: 'Razem' });
    this.setDataLabel({ key: 'jan', value: 'Styczeń' });
    this.setDataLabel({ key: 'feb', value: 'Luty' });
    this.setDataLabel({ key: 'mar', value: 'Marzec' });
    this.setDataLabel({ key: 'apr', value: 'Kwiecień' });
    this.setDataLabel({ key: 'may', value: 'Maj' });
    this.setDataLabel({ key: 'jun', value: 'Czerwiec' });
    this.setDataLabel({ key: 'jul', value: 'Lipiec' });
    this.setDataLabel({ key: 'aug', value: 'Sierpień' });
    this.setDataLabel({ key: 'sep', value: 'Wrzesień' });
    this.setDataLabel({ key: 'oct', value: 'Październik' });
    this.setDataLabel({ key: 'nov', value: 'Listopad' });
    this.setDataLabel({ key: 'dec', value: 'Grudzień' });
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

  public goToDetails(event: any): void {
    if (event.isCurrent) {
      return;
    }
    if (event.href) {
      const queryParams = {
        type: event.type,
        path: event.path,
      };
      this.router.navigate([event.href], { queryParams });
      return;
    }

    const sourcePath = `${event.path}`;
    const months = this.months;
    const subs$: Observable<any>[] = [];
    if (event.hasEntries) {
      this.breadcrumbsService.formBreadcrumbs(event, this.dataLabels);

      const dataSource = [];
      months.map((month: any, index: number) => {
        const path = sourcePath.replace('month', month.key);
        subs$.push(this.readDataByType(path)
          .pipe(
            tap((entries: any[]) => {
              const foundEntry = entries.find(entry => entry.key === event.entry);
              let dataItem = {
                month: month.value,
                monthId: month.key,
                order: index,
                path: `${path}/${event.entry}/entries`,
                total: 0,
              };

              if (index === 11) {
                const dataLabel: DataLabel = {
                  key: foundEntry.key,
                  value: foundEntry.label
                };
                this.setDataLabel(dataLabel)
              }

              let total: number = 0;
              Object.keys(foundEntry.entries).forEach((key) => {
                total += foundEntry.entries[key].total;
                dataItem = {
                  ...dataItem,
                  [key]: {
                    total: foundEntry.entries[key].total,
                    label: foundEntry.entries[key].label,
                    hasEntries: Boolean(foundEntry.entries[key].entries),
                  },
                };
              });

              dataItem = {
                ...dataItem,
                total,
              };

              dataSource.push(dataItem);
            }))
        )
      });

      combineLatest(subs$).subscribe(() => {
        this.dataSource = dataSource;
        this.dataColumns = [];
        this.displayedColumns = [];
        this.setDataLabelsAndColumns(this.dataSource[0]);
        this.dataColumns = this.dataColumns.filter((dataColumn: string) => dataColumn !== 'hasEntries');
        this.setDisplayedColumns();
      });
    }
  }

  private setDisplayedColumns(): void {
    this.displayedColumns.push(DataProperty.month);
    this.displayedColumns.push(DataProperty.total);
    this.displayedColumns = this.displayedColumns.concat([
      ...new Set(this.dataColumns),
    ]);
  }

  public dataSource: any = [];
  public displayedColumns: any = [];

  private setDataColumns(labels: DataLabel[]): void {
    this.dataColumns = labels.map((label: any) => label.key);
  }

  private setDataLabels(labels: DataLabel[]): void {
    this.dataLabels = Object.assign(
      this.dataLabels,
      ...labels.map((item) => ({ [item.key]: item.value }))
    );
  }

}
