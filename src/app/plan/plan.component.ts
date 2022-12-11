import { Observable } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { SharedUtilsService } from '@shared/services/shared-utils.service';

import * as config from './plan.config';
import * as model from './plan.model';
import { PlanService } from './plan.service';
import { PlanHttpService } from './services/plan-http.service';

@Component({
  selector: 'hb-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss'],
})
export class PlanComponent implements OnInit {
  public navLinks: model.NavLink[] = config.navLinks;
  public windowSize$ = this.sharedUtilsService.windowSize$;
  public breadcrumbsState$: Observable<string[]> =
    this.planService.breadcrumbsState$;

  constructor(
    private readonly planService: PlanService,
    private readonly sharedUtilsService: SharedUtilsService,
    private readonly plansService: PlanHttpService
  ) {}

  public ngOnInit(): void {
    // this.planService.setDataLabels();
  }

  public initiatePlan(): void {
    const year: string = '2023';
    this.plansService.initiatePlan(year);
  }

  public create(): void {
    const uid: string = Math.random().toString(16).slice(2);
    const payload = {
      uid,
      label: 'Projekt',
      entries: {},
      path: `/2023/${uid}`,
    };
    this.plansService.createPlan(payload);
  }
}
