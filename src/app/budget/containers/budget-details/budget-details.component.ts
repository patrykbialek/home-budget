import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';

import { CoreService } from '@home-budget/core/core.service';
import * as fromModels from '@home-budget/budget/models';
import { BudgetFacadeService } from '@home-budget/budget/services/budget-facade.service';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BreadcrumbsItem } from '../../models/budget-breadcrumbs.model';
import * as config from '../../shared/budget.config';
import { BUDGET_FEATURE_CONFIG } from '@home-budget/budget/budget-feature.config';

@Component({
  selector: 'hb-budget-details',
  templateUrl: './budget-details.component.html',
  styleUrls: ['./budget-details.component.scss'],
  standalone: false
})
export class BudgetDetailsComponent implements OnDestroy, OnInit {
  form!: FormGroup;
  month: string | undefined;

  private isDataLoaded = false;
  private readonly destroy$ = new Subject<void>();

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly coreService = inject(CoreService);
  private readonly budgetFacadeService = inject(BudgetFacadeService);
  private readonly router = inject(Router);
  private readonly collection = inject(BUDGET_FEATURE_CONFIG).collection;

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.resetBreadcrumbs();
  }

  ngOnInit(): void {
    this.subscribeToRouteChange();
  }

  get dataLabels(): fromModels.DataLabels {
    return this.budgetFacadeService.dataLabels;
  }

  get breadcrumbs(): BreadcrumbsItem[] {
    return this.budgetFacadeService.breadcrumbs;
  }

  get dataSource(): fromModels.DataSourceDetails[] {
    return this.budgetFacadeService.dataSource;
  }

  get dataSourceFooter(): fromModels.DataSourceDetails {
    return this.budgetFacadeService.dataSourceFooter;
  }

  get dataColumns(): string[] {
    return this.budgetFacadeService.dataColumns;
  }

  get displayedColumns(): string[] {
    return this.budgetFacadeService.displayedColumns;
  }

  get isLoading(): boolean {
    return this.budgetFacadeService.isLoading;
  }

  editBudgetEntry(event: fromModels.BudgetEntry): void {
    this.budgetFacadeService.editBudgetEntry(event);
  }

  goToDetails(event: fromModels.BudgetEntry): void {
    this.budgetFacadeService.goToDetails(event);
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
    this.budgetFacadeService.formBreadcrumbs(this.formBudgetEntry(entry), this.dataLabels);
  }

  private formBudgetEntry(entry: string): fromModels.BudgetEntry {
    return {
      entry,
      label: this.dataLabels[entry],
      hasEntries: true,
      href: `/${this.coreService.year}/${this.collection}/${entry}`,
      isCurrent: false,
      path: null,
    };
  }

  private formMainEntry(params: fromModels.QueryParamsResponse): fromModels.BudgetEntry {
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
    this.budgetFacadeService.resetBreadcrumbs();
  }
}
