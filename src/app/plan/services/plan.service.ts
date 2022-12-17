import { BehaviorSubject, Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { PlanHttpService } from './plan-http.service';

export interface DataLabels {
  [key: string]: string;
}

export interface DataLabel {
  key: string;
  value: string;
}

const commonLabels: string[] = ['month', 'monthId', 'order', 'path', 'total'];

@Injectable({ providedIn: 'root' })
export class PlanService {
  private breadcrumbsSubject$ = new BehaviorSubject<string[]>([]);
  public breadcrumbsState$ = this.breadcrumbsSubject$.asObservable();
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
  public dataColumns: string[];
  public breadcrumbs: any[] = [];

  private main: string = 'plan';

  constructor(private readonly planHttpService: PlanHttpService) { }

  public get months(): any[] {
    return this.planHttpService.months;
  }

  public readData(sourcePath: string): Observable<any> {
    return this.planHttpService.readData(sourcePath);
  }

  public readDataByType(sourcePath: string): Observable<any> {
    return this.planHttpService.readDataByType(sourcePath);
  }

  public clearBreadcrumbsState(): void {
    this.breadcrumbsSubject$.next([]);
  }

  public setBreadcrumbsState(breadcrumbs: string[]): void {
    this.breadcrumbsSubject$.next(breadcrumbs);
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
    this.setDataLabel({ key: 'execution', value: 'Wykonanie' })
    this.setDataLabel({ key: 'expenses', value: 'Wydatki' })
    this.setDataLabel({ key: 'incomes', value: 'Przychody' })
    this.setDataLabel({ key: 'month', value: 'Miesiąc' })
    this.setDataLabel({ key: 'project', value: 'Projekt' })
    this.setDataLabel({ key: 'total', value: 'Razem' })
  }

  public formBreadcrumbs(event: any): void {
    const item: any = {
      ...event,
      label: this.dataLabels[event.entry],
      isCurrent: true,
    };
    this.breadcrumbs = this.breadcrumbs
      .map((breadcrumb: any) => {
        return {
          ...breadcrumb,
          isCurrent: breadcrumb.entry === item.entry,
        };
      })
    const foundBreadcrumb = this.breadcrumbs
      .find((breadcrumb: any) => breadcrumb.entry === item.entry);
    const selectedBreadcrumbIndex = this.breadcrumbs
      .indexOf(foundBreadcrumb);

    if (selectedBreadcrumbIndex > 0) {
      this.breadcrumbs.length = selectedBreadcrumbIndex + 1;
    }

    if (!foundBreadcrumb) {
      this.breadcrumbs.push(item);
    }
  }

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
