import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { planProjectEntities } from '@home-budget/plan/plan-project.data';
import { DataProperty } from '@home-budget/plan/plan.enum';
import { PlanService } from '@home-budget/plan/plan.service';

import * as config from '../../plan.config';
import * as model from '../../plan.model';

@Component({
  selector: "hb-plan-project",
  templateUrl: "./plan-project.component.html",
  styleUrls: ["./plan-project.component.scss"],
})
export class PlanProjectComponent implements OnInit {
  public displayedColumns: string[] = config.planProjectDetailsColumns;
  public dataSource: model.PlanProject[] = [];
  public total: number = 0;

  private main: string = "plan";
  private year: string = "2023";
  private plan: string = "project";

  constructor(
    private readonly planService: PlanService,
    private readonly router: Router
  ) {}

  public ngOnInit(): void {
    this.clearBreadcrumbsState();
    this.formData();
  }

  public goToDetails(event: model.GoToDetails): void {
    this.router.navigate(["./plan/details"], {
      queryParams: {
        type: event.type,
      },
    });
  }

  private clearBreadcrumbsState(): void {
    setTimeout(() => {
      this.planService.clearBreadcrumbsState();
    });
  }

  private formData(): void {
    this.dataSource = [...planProjectEntities];
    const plansStorageItem = JSON.parse(localStorage.getItem(this.main));
    this.formDataSource(
      this.getMonthTotals(DataProperty.incomes, plansStorageItem),
      DataProperty.incomes
    );
    this.formDataSource(
      this.getMonthTotals(DataProperty.expenses, plansStorageItem),
      DataProperty.expenses
    );
    this.formDataSourceTotal();
  }

  private getMonthTotals(
    type: string,
    plansStorageItem: any
  ): { [key: string]: number } {
    const months: string[] = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];
    let monthTotals: any = {};

    months.forEach((month: string) => {
      const storageItem =
        plansStorageItem[this.year][this.plan][month][DataProperty.entries][
          type
        ][DataProperty.entries];
      monthTotals = {
        ...monthTotals,
        [month]: this.getTotal(storageItem),
      };
    });
    return monthTotals;
  }

  private getTotal(storageItem): number {
    return Object.keys(storageItem)
      .map((key: string) => (storageItem[key] ? storageItem[key].total : 0))
      .reduce((partialSum, total) => partialSum + total, 0);
  }

  private formDataSource(
    monthTotals: { [key: string]: number },
    type: string
  ): void {
    this.dataSource = this.dataSource
      .map((entity: model.PlanProject) => {
        const rest: number =
          type === DataProperty.expenses
            ? entity.incomes - monthTotals[entity.monthId]
            : entity.incomes - entity.expenses;

        return {
          ...entity,
          monthId: entity.monthId,
          month: entity.month,
          [type]: monthTotals[entity.monthId],
          rest,
        };
      })
      .reduce(
        (
          array: model.PlanProject[],
          entity: model.PlanProject,
          index: number
        ) => {
          const currentEntity = { ...entity };
          const previousEntity = array[index - 1];
          currentEntity.increase =
            index === 0
              ? currentEntity.rest
              : previousEntity.increase + currentEntity.rest;
          array.push(currentEntity);
          return array;
        },
        []
      );
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
