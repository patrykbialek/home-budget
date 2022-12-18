import { Injectable } from '@angular/core';

import { BreadcrumbsItem } from '../containers/plan-breadcrumbs/plan-breadcrumbs.model';

@Injectable({ providedIn: 'root' })
export class BreadcrumbsService {
  public breadcrumbs: BreadcrumbsItem[] = [];

  public formBreadcrumbs(event: any, dataLabels: any): void {
    const item: BreadcrumbsItem = {
      entry: event.entry,
      hasEntries: event.hasEntries,
      href: event.href,
      isCurrent: true,
      label: dataLabels[event.entry],
      path: event.path,
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
