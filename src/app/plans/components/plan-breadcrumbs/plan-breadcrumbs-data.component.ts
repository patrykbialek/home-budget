import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { BreadcrumbsItem } from '@home-budget/plans/models/plan-breadcrumbs.model';

@Component({
  selector: 'hb-plan-breadcrumbs-data',
  templateUrl: './plan-breadcrumbs-data.component.html',
  styleUrls: ['./plan-breadcrumbs-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PlanBreadcrumbsDataComponent {
  breadcrumbs = input.required<BreadcrumbsItem[]>();
  isAddColumnButtonShown = input.required<boolean>();

  addColumn = output<void>();
  goToDetails = output<BreadcrumbsItem>();
}
