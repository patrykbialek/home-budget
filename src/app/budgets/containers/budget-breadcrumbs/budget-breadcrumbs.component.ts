import { Component, inject } from '@angular/core';

import * as fromModels from '@budgets/models';

import { BudgetsFacadeService } from '@budgets/services/budgets-facade.service';

@Component({
  selector: 'hb-budget-breadcrumbs',
  templateUrl: './budget-breadcrumbs.component.html',
  styleUrls: ['./budget-breadcrumbs.component.scss'],
  standalone: false
})
export class BudgetBreadcrumbsComponent {
  private readonly budgetsFacadeService = inject(BudgetsFacadeService);

  get breadcrumbs(): fromModels.BreadcrumbsItem[] {
    return this.budgetsFacadeService.breadcrumbs;
  }

  get isAddColumnButtonShown(): boolean {
    // NOTE: to use in the future, based on roles, etc.
    return true;
  }

  addPlanEntryColumn(): void {
    this.budgetsFacadeService.addPlanEntryColumn();
  }

  goToDetails(event: fromModels.BreadcrumbsItem): void {
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
