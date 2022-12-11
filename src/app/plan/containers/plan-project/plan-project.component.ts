import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataProperty } from '@home-budget/plan/plan.enum';
import { PlanService } from '@home-budget/plan/plan.service';

import * as config from '../../plan.config';
import * as model from '../../plan.model';
import { PlanHttpService } from '../../services/plan-http.service';

@Component({
  selector: 'hb-plan-project',
  templateUrl: './plan-project.component.html',
  styleUrls: ['./plan-project.component.scss'],
})
export class PlanProjectComponent implements OnInit {
  public displayedColumns: string[] = config.planProjectDetailsColumns;
  public dataSource: any[] = [];
  public dataSourceIncomes: any[] = [];
  public dataSourceExpenses: any[] = [];
  public total: number = 0;

  private main: string = 'plan';
  private year: string = '2023';
  private plan: string = 'project';

  constructor(
    private readonly planService: PlanService,
    private readonly plansService: PlanHttpService,
    private readonly router: Router
  ) {}

  public ngOnInit(): void {
    this.clearBreadcrumbsState();
    this.readData();
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
    this.formDataSource(DataProperty.incomes, data[0].entries.project.entries);
    this.formDataSourceTotal();
  }

  private getTotal(storageItem): number {
    return Object.keys(storageItem)
      .map((key: string) => {
        return storageItem[key] ? storageItem[key].total : 0;
      })
      .reduce((partialSum, total) => partialSum + total, 0);
  }

  private formDataSourceIncomes(type: string, source: any): any {
    const dataIncomes = source['incomes'].entries;
    this.dataSourceIncomes = Object.keys(dataIncomes)
      .map((entity: any) => {
        const incomes: number = dataIncomes[entity].total;
        const month: string = dataIncomes[entity].label;
        const order: number = dataIncomes[entity].order;
        const incomesPath: string = dataIncomes[entity].path;

        return {
          incomes,
          month,
          order,
          increase: 0,
          monthId: entity,
          incomesPath,
        };
      })
      .sort((first: any, last: any) => first.order - last.order);
  }

  private formDataSourceExpenses(type: string, source: any): any {
    const dataExpenses = source['expenses'].entries;
    this.dataSourceExpenses = Object.keys(dataExpenses)
      .map((entity: any) => {
        const expenses: number = dataExpenses[entity].total;
        const month: string = dataExpenses[entity].label;
        const order: number = dataExpenses[entity].order;
        const expensesPath: string = dataExpenses[entity].path;

        return {
          expenses,
          month,
          order,
          increase: 0,
          monthId: entity,
          expensesPath,
        };
      })
      .sort((first: any, last: any) => first.order - last.order);
  }

  private formDataSource(type: string, source: any): void {
    this.formDataSourceIncomes(type, source);
    this.formDataSourceExpenses(type, source);

    this.dataSource = this.dataSourceIncomes
      .map((entry: any) => {
        return {
          ...entry,
          expenses: this.dataSourceExpenses.find(
            (expense) => expense.month === entry.month
          ).expenses,
          expensesPath: this.dataSourceExpenses.find(
            (expense) => expense.month === entry.month
          ).expensesPath,
        };
      })
      .map((entry: any) => {
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

    localStorage.setItem('plan', JSON.stringify(this.dataSource));
  }

  private formDataSourceTotal(): void {
    this.total = this.dataSource.reduce(
      (previousValue: number, entity: model.PlanProject) => {
        return previousValue + entity.rest;
      },
      0
    );
  }

  public readData(): void {
    this.plansService.readData().subscribe((data: any) => {
      this.formData(data);
    });
  }
}
