import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { BreadcrumbsItem } from '@budgets/models/plan-breadcrumbs.model';

@Component({
  selector: 'hb-budget-breadcrumbs-data',
  templateUrl: './budget-breadcrumbs-data.component.html',
  styleUrls: ['./budget-breadcrumbs-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class BudgetBreadcrumbsDataComponent {
  breadcrumbs = input.required<BreadcrumbsItem[]>();
  isAddColumnButtonShown = input.required<boolean>();

  addColumn = output<void>();
  goToDetails = output<BreadcrumbsItem>();
}
