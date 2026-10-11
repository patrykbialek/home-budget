import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { BreadcrumbsItem } from '@home-budget/finance/models/finance-breadcrumbs.model';

@Component({
  selector: 'hb-finance-breadcrumbs-data',
  templateUrl: './finance-breadcrumbs-data.component.html',
  styleUrls: ['./finance-breadcrumbs-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class FinanceBreadcrumbsDataComponent {
  breadcrumbs = input.required<BreadcrumbsItem[]>();
  isAddColumnButtonShown = input.required<boolean>();

  addColumn = output<void>();
  goToDetails = output<BreadcrumbsItem>();
}
