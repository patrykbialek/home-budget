import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';

import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BudgetsFacadeService } from '@budgets/services/budgets-facade.service';
import { CoreService } from '@home-budget/core/core.service';

import * as fromModels from '@budgets/models';
import { BreadcrumbsItem } from '@budgets/models/plan-breadcrumbs.model';

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
  private readonly main: string = 'budgets';

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly budgetsFacadeService = inject(BudgetsFacadeService);
  private readonly coreService = inject(CoreService);
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
    this.budgetsFacadeService.formBreadcrumbs(this.formPlanEntry(entry), this.dataLabels);
  }

  private formPlanEntry(entry: string): fromModels.PlanEntry {
    return {
      entry,
      label: this.dataLabels[entry],
      hasEntries: true,
      href: `/${this.coreService.year}/${this.main}/${entry}`,
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
    this.budgetsFacadeService.resetBreadcrumbs();
  }
}
