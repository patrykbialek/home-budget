import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  public dataSourceExpenses: any[] = [];
  public dataSourceIncomes: any[] = [];
  public total: number = 0;

  private planType: string;
  private readonly main: string = 'plan';
  private readonly year: string = '2023';

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly planService: PlanService,
    private readonly router: Router,
  ) { }

  public ngOnInit(): void {
    this.planService.setCommonDataLables();
    this.planService.setDefaultDataSource();
    this.displayedColumns = ['month', 'incomes', 'expenses', 'rest', 'increase'];
    this.dataSource = this.planService.defaultDataSource;
    this.activatedRoute.url.subscribe((response: any) => this.planType = response[0].path)

    const sourcePath: string = `${this.year}/entries`;
    this.readData(sourcePath);
  }

  public goToDetails(event: model.GoToDetails): void {
    this.router.navigate([`./${this.main}/${this.planType}/details`], {
      queryParams: {
        path: `${event.path}`,
        type: event.type,
      },
    });
  }

  public get dataLabels(): model.DataLabels {
    return this.planService.dataLabels;
  }

  public readData(sourcePath: string): void {
    this.planService.readData(sourcePath)
      .subscribe((data: any) => this.formData(data));
  }

  private formData(data?: any): void {
    const dataSource: any[] = data
      .map((entry: any) => {
        const expenses: number = this.calculateTotal(
          this.formEntry(entry, 'expenses')
        );
        const incomes: number = this.calculateTotal(
          this.formEntry(entry, 'incomes')
        );

        return {
          expenses,
          incomes,
          increase: 0,
          month: entry.key,
          order: entry.order,
          path: `${this.year}/entries/month/entries/${this.planType}`,
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

    this.dataSource = dataSource;
    this.formDataSourceTotal();
  }

  private calculateTotal(data: any): number {
    let total: number = 0;
    Object.keys(data)
      .forEach((key: string) => total += data[key].total);
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
}
