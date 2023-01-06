import { Component, OnInit } from '@angular/core';
import { SharedUtilsService } from '@shared/services/shared-utils.service';

import * as config from './shared/plans.config';
import * as fromModels from '@home-budget/plans/models';
import { PlanService } from './services/plan.service';
import { PlanHttpService } from './services/plan-http.service';

@Component({
  selector: 'hb-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss'],
})
export class PlansComponent implements OnInit {
  public navLinks: fromModels.NavLink[] = config.navLinks;
  public windowSize$ = this.sharedUtilsService.windowSize$;

  constructor(
    private readonly planHttpService: PlanHttpService,
    private readonly planService: PlanService,
    private readonly sharedUtilsService: SharedUtilsService,
  ) { }

  public ngOnInit(): void {
    this.planService.setCommonDataLables();
  }

  public initiatePlan(): void {
    const year: string = '2023';
    this.planHttpService.initiatePlan(year);
  }

  public create(): void {
    const uid: string = Math.random().toString(16).slice(2);
    const payload = {
      uid,
      label: 'Projekt',
      entries: {},
      path: `/2023/${uid}`,
    };
    this.planHttpService.createPlan(payload);
  }

  public addColumn(): void {
    this.planService.addColumn();
  }
}
