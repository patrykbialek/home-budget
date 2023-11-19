import { Component } from '@angular/core';

import * as fromModels from '@budgets/models';

import { BudgetsFacadeService } from '@budgets/services/budgets-facade.service';

@Component({
  selector: 'hb-budget-breadcrumbs',
  templateUrl: './budget-breadcrumbs.component.html',
  styleUrls: ['./budget-breadcrumbs.component.scss'],
})
export class BudgetBreadcrumbsComponent {

  constructor(
    private readonly budgetsFacadeService: BudgetsFacadeService,
  ) { }

  public get breadcrumbs(): fromModels.BreadcrumbsItem[] {
    return this.budgetsFacadeService.breadcrumbs;
  }

  public get isAddColumnButtonShown(): boolean {
    // NOTE: to use in the future, based on roles, etc.
    return true;
  }

  public addPlanEntryColumn(): void {
    this.budgetsFacadeService.addPlanEntryColumn();
  }

  public goToDetails(event: fromModels.BreadcrumbsItem): void {
    const { entry, hasEntries, label, isCurrent, href, path } = event;
    const planEntry: fromModels.PlanEntry = {
      entry,
      hasEntries,
      href,
      isCurrent,
      label,
      path,
    };
    this.budgetsFacadeService.goToDetails(planEntry);
  }

}
