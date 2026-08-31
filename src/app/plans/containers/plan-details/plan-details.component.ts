import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';

import * as fromModels from '@home-budget/plans/models';
import { PlansFacadeService } from '@home-budget/plans/services/plans-facade.service';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BreadcrumbsItem } from '../../models/plan-breadcrumbs.model';
import * as config from '../../shared/plans.config';

@Component({
  selector: 'hb-plan-details',
  templateUrl: './plan-details.component.html',
  styleUrls: ['./plan-details.component.scss'],
  standalone: false
})
export class PlanDetailsComponent implements OnDestroy, OnInit {
  form!: FormGroup;
  month: string | undefined;

  private isDataLoaded = false;
  private readonly destroy$ = new Subject<void>();

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly plansFacadeService = inject(PlansFacadeService);
  private readonly router = inject(Router);

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.resetBreadcrumbs();
  }

  ngOnInit(): void {
    this.subscribeToRouteChange();
  }

  get dataLabels(): fromModels.DataLabels {
    return this.plansFacadeService.dataLabels;
  }

  get breadcrumbs(): BreadcrumbsItem[] {
    return this.plansFacadeService.breadcrumbs;
  }

  get dataSource(): fromModels.DataSourceDetails[] {
    return this.plansFacadeService.dataSource;
  }

  get dataSourceFooter(): fromModels.DataSourceDetails {
    return this.plansFacadeService.dataSourceFooter;
  }

  get dataColumns(): string[] {
    return this.plansFacadeService.dataColumns;
  }

  get displayedColumns(): string[] {
    return this.plansFacadeService.displayedColumns;
  }

  get isLoading(): boolean {
    return this.plansFacadeService.isLoading;
  }

  editPlanEntry(event: fromModels.PlanEntry): void {
    this.plansFacadeService.editPlanEntry(event);
  }

  goToDetails(event: fromModels.PlanEntry): void {
    this.plansFacadeService.goToDetails(event);
  }

  private subscribeToRouteChange(): void {
    combineLatest([
      this.activatedRoute.url,
      this.activatedRoute.queryParams,
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        const typed = response as [UrlSegment[], fromModels.QueryParamsResponse];
        if (typed && typed[1].path) {
          this.handleWhenPathIsPassed(typed);
          return;
        }

        if (!this.isDataLoaded) {
          this.navigateToParentRoute();
        }
      });
  }

  private handleWhenPathIsPassed(response: [UrlSegment[], fromModels.QueryParamsResponse]): void {
    this.addMainBreadcrumb(response[0][0].path);
    this.goToDetails(this.formMainEntry(response[1]));
    this.reloadCurrentRoute();
    this.isDataLoaded = true;
  }

  private addMainBreadcrumb(entry: string): void {
    this.plansFacadeService.formBreadcrumbs(this.formPlanEntry(entry), this.dataLabels);
  }

  private formPlanEntry(entry: string): fromModels.PlanEntry {
    return {
      entry,
      label: this.dataLabels[entry],
      hasEntries: true,
      href: `./plans/${entry}`,
      isCurrent: false,
      path: null,
    };
  }

  private formMainEntry(params: fromModels.QueryParamsResponse): fromModels.PlanEntry {
    return {
      entry: params.type,
      hasEntries: true,
      path: `${params.path}/entries`,
    };
  }

  private reloadCurrentRoute(): void {
    this.router.navigate([], { relativeTo: this.activatedRoute });
  }

  private navigateToParentRoute(): void {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  private resetBreadcrumbs(): void {
    this.plansFacadeService.resetBreadcrumbs();
  }
}
