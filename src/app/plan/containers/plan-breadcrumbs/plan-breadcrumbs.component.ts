import { Component } from '@angular/core';
import { PlanService } from '@home-budget/plan/services/plan.service';
import { BreadcrumbsService } from '../../services/breadcrumbs.service';

@Component({
  selector: 'hb-plan-breadcrumbs',
  templateUrl: './plan-breadcrumbs.component.html',
  styleUrls: ['./plan-breadcrumbs.component.scss'],
})
export class PlanBreadcrumbsComponent {

  constructor(
    private readonly breadcrumbsService: BreadcrumbsService,
    private readonly planService: PlanService,
  ) { }

  public get breadCrumbs(): any[] {
    return this.breadcrumbsService.breadcrumbs;
  }

  public goToDetails(event: any): void {
    this.planService.goToDetails(event);
  }

}
