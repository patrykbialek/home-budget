import { BehaviorSubject } from 'rxjs';

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PlanService {
  private breadcrumbsSubject$ = new BehaviorSubject<string[]>([]);
  public breadcrumbsState$ = this.breadcrumbsSubject$.asObservable();
  public dataLabels: {[key:string]: string} = {
    'project': 'Projekt',
    'expenses': 'Wydatki',
    'incomes': 'Przychody',
    'entries': ' . ',
    '2023': '2023',
  }

  private main: string = 'plan';

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
      };
      return data;
  }

  public setDataLabels(): void {
    const data = JSON.parse(localStorage.getItem(this.main))['2023'];

    const search = (data) =>
      Object.keys(data).forEach((dataItem) => {
        if (data[dataItem]['label']) {
          this.dataLabels = {
            ...this.dataLabels,
            [data[dataItem]]: data[dataItem]['label'],
          };
        } else {
          Object.keys(data[dataItem]).forEach((entry) => {
            if (data[dataItem][entry]['label']) {
              this.dataLabels = {
                ...this.dataLabels,
                [entry]: data[dataItem][entry]['label'],
              };
            }
          });
        }
      });

    search(data);

    Object.keys(data).forEach((a) => {
      Object.keys(data[a]).forEach((b) => {
        search(data[a][b]);

        if (data[a][b]['entries']) {
          Object.keys(data[a][b]['entries']).forEach((c) => {
            search(data[a][b]['entries'][c]);

            if (data[a][b]['entries'][c]['entries']) {
              Object.keys(data[a][b]['entries'][c]['entries']).forEach((d) => {
                search(data[a][b]['entries'][c]['entries'][d]);

                if (data[a][b]['entries'][c]['entries'][d]['entries']) {
                  Object.keys(data[a][b]['entries'][c]['entries'][d]['entries']).forEach((e) => {
                      search(data[a][b]['entries'][c]['entries'][d]['entries'][e]);
                    }
                  );
                }
              });
            }
          });
        }
      });
    });

    this.dataLabels = {
      ...this.dataLabels,
      total: 'Razem',
      monthLabel: 'Miesiąc',
      project: 'Projekt',
      execution: 'Wykonanie',
    };
  }
}
