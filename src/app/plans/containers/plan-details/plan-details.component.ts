import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';

import * as config from '../../shared/plans.config';
import * as fromModels from '@home-budget/plans/models';
import { combineLatest } from 'rxjs';
import { BreadcrumbsItem } from '../../models/plan-breadcrumbs.model';
import { PlansService } from '../../services/plans.service';
import { PlansFacadeService } from '@home-budget/plans/services/plans-facade.service';

@Component({
  selector: 'hb-plan-details',
  templateUrl: './plan-details.component.html',
  styleUrls: ['./plan-details.component.scss'],
})
export class PlanDetailsComponent implements OnDestroy, OnInit {
  public form: FormGroup;
  public month: string;

  private isDataLoaded: boolean;
  private readonly planType: fromModels.Item = config.planType[fromModels.DataProperty.project];
  private readonly planYear: string = '2023';

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly plansFacadeService: PlansFacadeService,
    private readonly router: Router,
  ) { }

  public ngOnDestroy(): void {
    this.resetBreadcrumbs();
  }

  public ngOnInit(): void {
    this.setDefaultDataSource();
    this.subscribeToRouteChange();
  }

  public get dataLabels(): fromModels.DataLabels {
    return this.plansFacadeService.dataLabels;
  }

  public get breadcrumbs(): BreadcrumbsItem[] {
    return this.plansFacadeService.breadcrumbs;
  }

  public get dataSource(): fromModels.DataSourceDetails[] {
    return this.plansFacadeService.dataSource;
  }

  public get dataSourceFooter(): fromModels.DataSourceDetails {
    return this.plansFacadeService.dataSourceFooter;
  }

  public get dataColumns(): string[] {
    return this.plansFacadeService.dataColumns;
  }

  public get displayedColumns(): string[] {
    return this.plansFacadeService.displayedColumns;
  }

  public get isLoading(): boolean {
    return this.plansFacadeService.isLoading;
  }

  public editPlanEntry(event: fromModels.PlanEntry): void {
    this.plansFacadeService.editPlanEntry(event);
  }

  public goToDetails(event: fromModels.PlanEntry): void {
    this.plansFacadeService.goToDetails(event);
  }

  private setDefaultDataSource() {
    this.plansFacadeService.setDefaultDataSource();
  }

  private subscribeToRouteChange(): void {
    combineLatest([
      this.activatedRoute.url,
      this.activatedRoute.queryParams,
    ])
      .subscribe((response: [UrlSegment[], fromModels.QueryParamsResponse]) => {
        if (response && response[1].path) {
          this.handleWhenPathIsPassed(response);
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
