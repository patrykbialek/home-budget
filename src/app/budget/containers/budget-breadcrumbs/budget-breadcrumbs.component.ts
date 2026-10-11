import { Component, inject } from '@angular/core';
import * as fromModels from '@home-budget/budget/models';
import { BudgetFacadeService } from '@home-budget/budget/services/budget-facade.service';

@Component({
  selector: 'hb-budget-breadcrumbs',
  templateUrl: './budget-breadcrumbs.component.html',
  styleUrls: ['./budget-breadcrumbs.component.scss'],
  standalone: false
})
export class BudgetBreadcrumbsComponent {
  private readonly budgetFacadeService = inject(BudgetFacadeService);

  get breadcrumbs(): fromModels.BreadcrumbsItem[] {
    return this.budgetFacadeService.breadcrumbs;
  }

  get isAddColumnButtonShown(): boolean {
    // NOTE: to use in the future, based on roles, etc.
    return true;
  }

  addBudgetEntryColumn(): void {
    this.budgetFacadeService.addBudgetEntryColumn();
  }

  goToDetails(event: fromModels.BreadcrumbsItem): void {
    const { entry, hasEntries, label, isCurrent, href, path } = event;
    const budgetEntry: fromModels.BudgetEntry = {
      entry,
      hasEntries,
      href,
      isCurrent,
      label,
      path,
    };
    this.budgetFacadeService.goToDetails(budgetEntry);
  }

}
