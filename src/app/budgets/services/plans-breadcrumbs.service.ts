import { Injectable } from '@angular/core';

import { BreadcrumbsItem } from '../models/plan-breadcrumbs.model';
import * as fromModels from '@budgets/models';

@Injectable({ providedIn: 'root' })
export class PlansBreadcrumbsService {
  public breadcrumbs: BreadcrumbsItem[] = [];

  public resetBreadcrumbs(): void {
    this.breadcrumbs = [];
  }

  public formBreadcrumbs(planEntry: fromModels.PlanEntry, dataLabels: fromModels.DataLabels): void {
    const item: BreadcrumbsItem = {
      entry: planEntry.entry,
      hasEntries: planEntry.hasEntries,
      href: planEntry.href,
      isCurrent: true,
      label: dataLabels[planEntry.entry],
      path: planEntry.path,
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
