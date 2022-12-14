import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataProperty } from '@home-budget/plan/plan.enum';
import { PlanService } from '@home-budget/plan/services/plan.service';

import * as config from '../../plan.config';
import * as model from '../../plan.model';

@Component({
  selector: 'hb-plan-project',
  templateUrl: './plan-project.component.html',
  styleUrls: ['./plan-project.component.scss'],
})
export class PlanProjectComponent implements OnInit {
  public displayedColumns: string[] = config.planColumns;
  public dataSource: any[] = [];
  public dataSourceIncomes: any[] = [];
  public dataSourceExpenses: any[] = [];
  public total: number = 0;

  private main: string = 'plan';
  private year: string = '2023';
  private plan: string = 'project';

  constructor(
    private readonly planService: PlanService,
    private readonly router: Router
  ) {}

  public ngOnInit(): void {
    this.clearBreadcrumbsState();

    const sourcePath: string = `2023/entries`;
    this.readData(sourcePath);
  }

  public goToDetails(event: model.GoToDetails): void {
    this.router.navigate(['./plan/details'], {
      queryParams: {
        type: event.type,
        path: event.path,
      },
    });
  }

  private clearBreadcrumbsState(): void {
    setTimeout(() => {
      this.planService.clearBreadcrumbsState();
    });
  }

  private formData(data?: any): void {
    this.dataSource = [];
    this.dataSource = data
      .map((entry: any) => {
        let expenses: number = this.calculateTotal(
          this.formEntry(entry, 'expenses')
        );
        let incomes: number = this.calculateTotal(
          this.formEntry(entry, 'incomes')
        );

        return {
          expenses,
          incomes,
          increase: 0,
          month: entry.label,
          order: entry.order,
          path: '2023/entries/month/entries/project/entries',
          rest: 0,
        };
      })
      .sort((first: any, last: any) => first.order - last.order)
      .map((entry: any) => {
        delete entry.order;
        return {
          ...entry,
          rest: entry.incomes - entry.expenses,
        };
      })
      .reduce((array: any[], entity: any, index: number) => {
        const currentEntity = { ...entity };
        const previousEntity = array[index - 1];
        currentEntity.increase =
          index === 0
            ? currentEntity.rest
            : previousEntity.increase + currentEntity.rest;
        array.push(currentEntity);
        return array;
      }, []);

    this.formDataSourceTotal();
  }

  private calculateTotal(data: any): number {
    let total: number = 0;
    Object.keys(data).forEach((key: string) => {
      total += data[key].total;
    });
    return total;
  }

  private formEntry(entry: any, node: string): any {
    return entry.entries.project.entries[node].entries;
  }

  private formDataSourceTotal(): void {
    this.total = this.dataSource.reduce(
      (previousValue: number, entity: model.PlanProject) => {
        return previousValue + entity.rest;
      },
      0
    );
  }

  public readData(sourcePath: string): void {
    this.planService.readData(sourcePath).subscribe((data: any) => {
      this.formData(data);
    });
  }
}
