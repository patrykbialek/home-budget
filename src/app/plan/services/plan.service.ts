import { BehaviorSubject, Observable } from "rxjs";

import { Injectable } from "@angular/core";
import { PlanHttpService } from "./plan-http.service";

export interface DataLabels {
  [key: string]: string;
}

export interface DataLabel {
  key: string;
  value: string;
}

@Injectable({ providedIn: "root" })
export class PlanService {
  private breadcrumbsSubject$ = new BehaviorSubject<string[]>([]);
  public breadcrumbsState$ = this.breadcrumbsSubject$.asObservable();
  public dataLabels: DataLabels = {
    month: "Miesiąc",
    total: "Razem",
  };
  public dataColumns: string[];

  private main: string = "plan";

  constructor(private readonly planHttpService: PlanHttpService) {}

  public readData(): Observable<any> {
    return this.planHttpService.readData();
  }

  public clearBreadcrumbsState(): void {
    this.breadcrumbsSubject$.next([]);
  }

  public setBreadcrumbsState(breadcrumbs: string[]): void {
    this.breadcrumbsSubject$.next(breadcrumbs);
  }

  public getDataItem(path: string): any {
    let data = JSON.parse(localStorage.getItem(this.main))["2023"];
    for (let i = 0, paths = path.split("."), len = paths.length; i < len; i++) {
      data = data[paths[i]];
    }
    return data;
  }

  public setDataLabelsAndColumns(data: any): void {
    const labels: DataLabel[] = Object.keys(data["jan"].entries)
      .map((dataItem: string) => {
        return {
          key: dataItem,
          order: data["jan"].entries[dataItem].order,
          value: <string>data["jan"].entries[dataItem].label,
        };
      })
      .sort((first: any, last: any) => first.order - last.order)
      .map((entry: any) => {
        delete entry.order;
        return entry;
      });

    this.setDataColumns(labels);
    this.setDataLabels(labels);
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
