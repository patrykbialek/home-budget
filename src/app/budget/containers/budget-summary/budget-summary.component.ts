import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { filter, switchMap, takeUntil, tap } from 'rxjs/operators';

import * as config from '../../shared/budget.config';
import * as fromModels from '@home-budget/budget/models';
import { BudgetFacadeService } from '../../services/budget-facade.service';
import { AuthenticationFacadeService } from '@authentication/store';

import { CoreService } from '@home-budget/core/core.service';
import { BUDGET_FEATURE_CONFIG } from '@home-budget/budget/budget-feature.config';

@Component({
  selector: 'hb-budget-summary',
  templateUrl: './budget-summary.component.html',
  styleUrls: ['./budget-summary.component.scss'],
  standalone: false
})
export class BudgetSummaryComponent implements OnDestroy, OnInit {
  displayedColumns: string[] = config.budgetColumns;
  dataSource: fromModels.DataSourceSummary[] = config.defaultDataSource;
  isLoading = false;

  private rawData: fromModels.DataEntry[] = [];

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly authService = inject(AuthenticationFacadeService);
  private readonly coreService = inject(CoreService);
  private readonly budgetFacadeService = inject(BudgetFacadeService);
  private readonly router = inject(Router);

  year$ = this.coreService.year$
    .pipe(
      tap((year: string) => this.handleOnYearChange(year)),
    );

  private budgetType: string | undefined;
  private readonly destroy$ = new Subject<void>();
  private dataSubscription: Subscription | undefined;

  private readonly main: string = inject(BUDGET_FEATURE_CONFIG).collection;
  private year: string | undefined;
  private sourcePath = '';

  ngOnInit(): void {
    this.activatedRoute.url.pipe(
      takeUntil(this.destroy$),
    ).subscribe((segments: UrlSegment[]) => {
      this.budgetType = segments[0]?.path;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goToDetails(event: fromModels.QueryParamsResponse): void {
    this.router.navigate(['/', this.year, this.main, this.budgetType, 'details'], {
      queryParams: {
        path: `${event.path}`,
        type: event.type,
      },
    });
  }

  get dataLabels(): fromModels.DataLabels {
    return this.budgetFacadeService.dataLabels;
  }

  get dataSourceTotal(): number {
    return this.dataSource.reduce(
      (previousValue: number, entity: fromModels.DataSourceSummary) => {
        return previousValue + entity.rest;
      },
      0
    );
  }

  get isExecutionTab(): boolean {
    return this.budgetType === 'execution';
  }

  get dataSourceProjectTotal(): number {
    return this.budgetFacadeService.formProjectTotal(this.rawData, this.budgetConfig);
  }

  readData(): void {
    this.dataSubscription?.unsubscribe();
    this.dataSubscription = this.authService.user$
      .pipe(
        filter(Boolean),
        switchMap((user) => this.budgetFacadeService.readData(this.sourcePath, user.uid)),
        takeUntil(this.destroy$),
      )
      .subscribe((data: fromModels.DataEntry[]) => this.formData(data));
  }

  private setCommonDataLabels(): void {
    this.budgetFacadeService.setCommonDataLabels();
  }

  private formData(data: fromModels.DataEntry[]): void {
    this.rawData = data;
    this.dataSource = this.budgetFacadeService.formData(data, this.budgetConfig);
    setTimeout(() => {
      this.isLoading = false;
    });
  }

  private get budgetConfig(): fromModels.BudgetConfig {
    return { year: this.year ?? '', type: this.budgetType ?? '' };
  }

  private handleOnYearChange(year: string) {
    this.isLoading = true;
    this.year = year;
    this.sourcePath = `${this.year}/entries`;
    this.setCommonDataLabels();
    this.readData();
  }
}
