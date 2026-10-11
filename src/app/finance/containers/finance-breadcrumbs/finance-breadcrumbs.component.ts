import { Component, inject } from '@angular/core';

import { BreadcrumbsItem, FinanceEntry } from '@home-budget/finance/models';
import { FinanceBreadcrumbsDataComponent } from '../../components/finance-breadcrumbs/finance-breadcrumbs-data.component';
import { FinanceFacadeService } from '@home-budget/finance/services/finance-facade.service';

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
      path: path ?? null,
    };
    this.financeFacadeService.goToDetails(financeEntry);
  }

}
