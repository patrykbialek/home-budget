import { Injectable } from '@angular/core';

import { BreadcrumbsItem } from '../models/budget-breadcrumbs.model';
import * as fromModels from '@home-budget/budget/models';

@Injectable()
export class BudgetBreadcrumbsService {
  breadcrumbs: BreadcrumbsItem[] = [];

  resetBreadcrumbs(): void {
    this.breadcrumbs = [];
  }

  formBreadcrumbs(budgetEntry: fromModels.BudgetEntry, dataLabels: fromModels.DataLabels): void {
    const item: BreadcrumbsItem = {
      entry: budgetEntry.entry,
      hasEntries: budgetEntry.hasEntries,
      href: budgetEntry.href,
      isCurrent: true,
      label: dataLabels[budgetEntry.entry],
      path: budgetEntry.path,
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
