import { Injectable } from '@angular/core';

import { BreadcrumbsItem } from '../models/finance-breadcrumbs.model';
import { DataLabels, FinanceEntry } from '@home-budget/finance/models';

@Injectable()
export class FinanceBreadcrumbsService {
  breadcrumbs: BreadcrumbsItem[] = [];

  resetBreadcrumbs(): void {
    this.breadcrumbs = [];
  }

  formBreadcrumbs(financeEntry: FinanceEntry, dataLabels: DataLabels): void {
    const item: BreadcrumbsItem = {
      entry: financeEntry.entry,
      hasEntries: financeEntry.hasEntries,
      href: financeEntry.href,
      isCurrent: true,
      label: dataLabels[financeEntry.entry],
      path: financeEntry.path,
    };
    this.breadcrumbs = this.breadcrumbs
      .map((breadcrumb: BreadcrumbsItem) => {
        return {
          ...breadcrumb,
          isCurrent: breadcrumb.entry === item.entry,
        };
      });
    const foundBreadcrumb: BreadcrumbsItem = this.breadcrumbs
      .find((breadcrumb: BreadcrumbsItem) => breadcrumb.entry === item.entry);
    const selectedBreadcrumbIndex: number = this.breadcrumbs
      .indexOf(foundBreadcrumb);

    if (selectedBreadcrumbIndex > 0) {
      this.breadcrumbs.length = selectedBreadcrumbIndex + 1;
    }

    if (!foundBreadcrumb) {
      this.breadcrumbs.push(item);
    }
  }

}
