import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { planProjectEntities } from '@home-budget/plan/plan-project.data';
import { PlanService } from '@home-budget/plan/plan.service';

import * as config from '../../plan.config';
import * as model from '../../plan.model';

@Component({
  selector: 'hb-plan-project',
  templateUrl: './plan-project.component.html',
  styleUrls: ['./plan-project.component.scss']
})
export class PlanProjectComponent implements OnInit {

  public displayedColumns: string[] = config.planProjectDetailsColumns;
  public dataSource: model.PlanProject[];

  private main: string = 'plan';
  private year: string = '2023';
  private plan: string = 'project';
  private month: string = 'january';
  private type: string = 'incomes';

  constructor(
    private readonly planService: PlanService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) { }

  public ngOnInit(): void {
    setTimeout(() => {
      this.planService.clearBreadcrumbsState();
    });

    const plansStorageItem = JSON.parse(localStorage.getItem(this.main));
    const storageItem = plansStorageItem[this.year][this.plan][this.month][this.type];
    const total = Object.keys(storageItem)
      .map((key: string) => {
        return storageItem[key] ? storageItem[key].total : 0;
      })
      .reduce((partialSum, a) => partialSum + a, 0);

    this.dataSource = planProjectEntities.map((entity: model.PlanProject) => {
      return {
        ...entity,
        incomes: entity.monthId === this.month ? total : entity.incomes,
      };
    });
  }

  public goToDetails(event: model.GoToDetails): void {
    this.router.navigate(
      ['./plan/details'],
      {
        queryParams: {
          transactionType: event.transactionType,
          monthId: event.monthId,
        },
      },
    );
  }
}
