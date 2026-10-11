import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';

import { CoreService } from '@home-budget/core/core.service';
import { FINANCE_FEATURE_CONFIG } from '@home-budget/finance/finance-feature.config';
import * as fromModels from '@home-budget/finance/models';
import { FinanceFacadeService } from '@home-budget/finance/services/finance-facade.service';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FinanceDetailsDataComponent } from '../../components/finance-details/finance-details-data.component';
import { BreadcrumbsItem } from '../../models/finance-breadcrumbs.model';

@Component({
  selector: 'hb-finance-details',
  templateUrl: './finance-details.component.html',
  styleUrls: ['./finance-details.component.scss'],
  imports: [FinanceDetailsDataComponent]
})
export class FinanceDetailsComponent implements OnDestroy, OnInit {
  form!: FormGroup;
  month: string | undefined;

  private isDataLoaded = false;
  private readonly destroy$ = new Subject<void>();

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly coreService = inject(CoreService);
  private readonly financeFacadeService = inject(FinanceFacadeService);
  private readonly router = inject(Router);
  private readonly collection = inject(FINANCE_FEATURE_CONFIG).collection;

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.resetBreadcrumbs();
  }

  ngOnInit(): void {
    this.subscribeToRouteChange();
  }

  get dataLabels(): fromModels.DataLabels {
    return this.financeFacadeService.dataLabels;
  }

  get breadcrumbs(): BreadcrumbsItem[] {
    return this.financeFacadeService.breadcrumbs;
  }

  get dataSource(): fromModels.DataSourceDetails[] {
    return this.financeFacadeService.dataSource;
  }

  get dataSourceFooter(): fromModels.DataSourceDetails {
    return this.financeFacadeService.dataSourceFooter;
  }

  get dataColumns(): string[] {
    return this.financeFacadeService.dataColumns;
  }

  get displayedColumns(): string[] {
    return this.financeFacadeService.displayedColumns;
  }

  get isLoading(): boolean {
    return this.financeFacadeService.isLoading;
  }

  editFinanceEntry(event: fromModels.FinanceEntry): void {
    this.financeFacadeService.editFinanceEntry(event);
  }

  goToDetails(event: fromModels.FinanceEntry): void {
    this.financeFacadeService.goToDetails(event);
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
    this.financeFacadeService.formBreadcrumbs(this.formFinanceEntry(entry), this.dataLabels);
  }

  private formFinanceEntry(entry: string): fromModels.FinanceEntry {
    return {
      entry,
      label: this.dataLabels[entry],
      hasEntries: true,
      href: `/${this.coreService.year}/${this.collection}/${entry}`,
      isCurrent: false,
      path: null,
    };
  }

  private formMainEntry(params: fromModels.QueryParamsResponse): fromModels.FinanceEntry {
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
    this.financeFacadeService.resetBreadcrumbs();
  }
}
