import { Component } from '@angular/core';
import * as fromModels from '@home-budget/plans/models';
import { PlanService } from '../../../plans/services/plan.service';
import { BreadcrumbsService } from '../../services/breadcrumbs.service';
import { BreadcrumbsItem } from '../../models/plan-breadcrumbs.model';

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

  public get breadCrumbs(): BreadcrumbsItem[] {
    return this.breadcrumbsService.breadcrumbs;
  }

  public get isAddColumnButtonShown(): boolean {
    if (!this.planService.currentEntries){
      return false;
    }
    const exludedEntries: string[] = ['expenses', 'incomes'];
    return !exludedEntries.includes(this.planService.currentEntries.entry);
  }

  public addColumn(): void {
    this.planService.addColumn();
  }

  public goToDetails(event: BreadcrumbsItem): void {
    const { entry, hasEntries, label, isCurrent, href, path } = event;
    const planEntry: fromModels.PlanEntry = {
      entry,
      hasEntries,
      href,
      isCurrent,
      label,
      path,
    };
    this.planService.goToDetails(planEntry);
  }

}
