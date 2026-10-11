import { Component, inject } from '@angular/core';

import { BreadcrumbsItem, FinanceEntry } from '@home-budget/finance/models';
import { FinanceFacadeService } from '@home-budget/finance/services/finance-facade.service';
import { FinanceBreadcrumbsDataComponent } from '../../components/finance-breadcrumbs/finance-breadcrumbs-data.component';

@Component({
  selector: 'hb-finance-breadcrumbs',
  templateUrl: './finance-breadcrumbs.component.html',
  styleUrls: ['./finance-breadcrumbs.component.scss'],
  imports: [FinanceBreadcrumbsDataComponent]
})
export class FinanceBreadcrumbsComponent {
  private readonly financeFacadeService = inject(FinanceFacadeService);

  get breadcrumbs(): BreadcrumbsItem[] {
    return this.financeFacadeService.breadcrumbs;
  }

  get isAddColumnButtonShown(): boolean {
    // NOTE: to use in the future, based on roles, etc.
    return true;
  }

  addFinanceEntryColumn(): void {
    this.financeFacadeService.addFinanceEntryColumn();
  }

  goToDetails(event: BreadcrumbsItem): void {
    const { entry, hasEntries, label, isCurrent, href, path } = event;
    const financeEntry: FinanceEntry = {
      entry,
      hasEntries,
      href,
      isCurrent,
      label,
      path,
    };
    this.financeFacadeService.goToDetails(financeEntry);
  }

}
