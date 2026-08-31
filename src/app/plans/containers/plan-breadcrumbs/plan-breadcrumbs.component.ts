import { Component, inject } from '@angular/core';
import * as fromModels from '@home-budget/plans/models';
import { PlansFacadeService } from '@home-budget/plans/services/plans-facade.service';

@Component({
  selector: 'hb-plan-breadcrumbs',
  templateUrl: './plan-breadcrumbs.component.html',
  styleUrls: ['./plan-breadcrumbs.component.scss'],
  standalone: false
})
export class PlanBreadcrumbsComponent {
  private readonly plansFacadeService = inject(PlansFacadeService);

  get breadcrumbs(): fromModels.BreadcrumbsItem[] {
    return this.plansFacadeService.breadcrumbs;
  }

  get isAddColumnButtonShown(): boolean {
    // NOTE: to use in the future, based on roles, etc.
    return true;
  }

  addPlanEntryColumn(): void {
    this.plansFacadeService.addPlanEntryColumn();
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
    this.plansFacadeService.goToDetails(planEntry);
  }

}
