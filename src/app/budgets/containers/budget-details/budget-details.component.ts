import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';

import { combineLatest } from 'rxjs';

import { BudgetsFacadeService } from '@budgets/services/budgets-facade.service';

import * as fromModels from '@budgets/models';
import { BreadcrumbsItem } from '@budgets/models/plan-breadcrumbs.model';
import { CoreService } from '@home-budget/core/core.service';
import { tap } from 'rxjs/operators';
import * as config from '../../shared/budgets.config';

@Component({
  selector: 'hb-budget-details',
  templateUrl: './budget-details.component.html',
  styleUrls: ['./budget-details.component.scss'],
})
export class BudgetDetailsComponent implements OnDestroy, OnInit {
  form: FormGroup;
  month: string;

  private isDataLoaded: boolean;
  private year: string;
  private readonly planType: fromModels.Item = config.planType[fromModels.DataProperty.project];
  private readonly main: string = 'budgets';

  year$ = this.coreService.year$.pipe(tap((year: string) => {
    this.year = year;
  }));

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly budgetsFacadeService: BudgetsFacadeService,
    private readonly router: Router,
    private readonly coreService: CoreService,
  ) { }

  ngOnDestroy(): void {
    this.resetBreadcrumbs();
  }

  ngOnInit(): void {
    this.subscribeToRouteChange();
  }

  get dataLabels(): fromModels.DataLabels {
    return this.budgetsFacadeService.dataLabels;
  }

  get breadcrumbs(): BreadcrumbsItem[] {
    return this.budgetsFacadeService.breadcrumbs;
  }

  get dataSource(): fromModels.DataSourceDetails[] {
    return this.budgetsFacadeService.dataSource;
  }

  get dataSourceFooter(): fromModels.DataSourceDetails {
    return this.budgetsFacadeService.dataSourceFooter;
  }

  get dataColumns(): string[] {
    return this.budgetsFacadeService.dataColumns;
  }

  get displayedColumns(): string[] {
    return this.budgetsFacadeService.displayedColumns;
  }

  get isLoading(): boolean {
    return this.budgetsFacadeService.isLoading;
  }

  editPlanEntry(event: fromModels.PlanEntry): void {
    this.budgetsFacadeService.editPlanEntry(event);
  }

  goToDetails(event: fromModels.PlanEntry): void {
    this.budgetsFacadeService.goToDetails(event);
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
    this.budgetsFacadeService.formBreadcrumbs(this.formPlanEntry(entry), this.dataLabels);
  }

  private formPlanEntry(entry: string): fromModels.PlanEntry {
    return {
      entry,
      label: this.dataLabels[entry],
      hasEntries: true,
      href: `./${this.main}/${entry}`,
      isCurrent: false,
      path: null,
    };
  }

  private formMainEntry(params: fromModels.QueryParamsResponse): fromModels.PlanEntry {
    console.log(params)
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
    this.budgetsFacadeService.resetBreadcrumbs();
  }
}
