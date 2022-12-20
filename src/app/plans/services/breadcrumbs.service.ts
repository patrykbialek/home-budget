import { Injectable } from '@angular/core';

import { BreadcrumbsItem } from '../containers/plan-breadcrumbs/plan-breadcrumbs.model';
import { DataLabels, PlanEntry } from '../plans.model';

@Injectable({ providedIn: 'root' })
export class BreadcrumbsService {
  public breadcrumbs: BreadcrumbsItem[] = [];

  public formBreadcrumbs(planEntry: PlanEntry, dataLabels: DataLabels): void {
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
      })
    const foundBreadcrumb = this.breadcrumbs
      .find((breadcrumb: BreadcrumbsItem) => breadcrumb.entry === item.entry);
    const selectedBreadcrumbIndex = this.breadcrumbs
      .indexOf(foundBreadcrumb);

    if (selectedBreadcrumbIndex > 0) {
      this.breadcrumbs.length = selectedBreadcrumbIndex + 1;
    }

    if (!foundBreadcrumb) {
      this.breadcrumbs.push(item);
    }
  }

}
