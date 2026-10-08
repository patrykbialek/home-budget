import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';

import { Subject, Subscription } from 'rxjs';
import { filter, switchMap, takeUntil, tap } from 'rxjs/operators';

import { BudgetsFacadeService } from '@budgets/services/budgets-facade.service';
import { AuthenticationFacadeService } from '@home-budget/authentication/store';

import * as fromModels from '@budgets/models';
import * as config from '@budgets/shared/budgets.config';
import { CoreService } from '@home-budget/core/core.service';

@Component({
  selector: 'hb-budget-summary',
  templateUrl: './budget-summary.component.html',
  styleUrls: ['./budget-summary.component.scss'],
  standalone: false
})
export class BudgetSummaryComponent implements OnDestroy, OnInit {
  displayedColumns: string[] = config.planColumns;
  dataSource: fromModels.DataSourceSummary[] = config.defaultDataSource;
  isLoading = false;

  private rawData: fromModels.DataEntry[] = [];

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly authService = inject(AuthenticationFacadeService);
  private readonly budgetsFacadeService = inject(BudgetsFacadeService);
  private readonly router = inject(Router);
  private readonly coreService = inject(CoreService);

  year$ = this.coreService.year$
    .pipe(tap((year: string) => this.handleOnYearChange(year)));

  private planType: string | undefined;
  private readonly destroy$ = new Subject<void>();
  private dataSubscription: Subscription | undefined;

  private readonly main: string = 'budgets';
  private year: string | undefined;
  private sourcePath = '';

  ngOnInit(): void {
    this.activatedRoute.url.pipe(
      takeUntil(this.destroy$),
    ).subscribe((segments: UrlSegment[]) => {
      this.planType = segments[0]?.path;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goToDetails(event: fromModels.QueryParamsResponse): void {
    this.router.navigate(['/', this.year, this.main, this.planType, 'details'], {
      queryParams: {
        path: `${event.path}`,
        type: event.type,
      },
    });
  }

  get dataLabels(): fromModels.DataLabels {
    return this.budgetsFacadeService.dataLabels;
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
    return this.planType === 'execution';
  }

  get dataSourceProjectTotal(): number {
    return this.budgetsFacadeService.formProjectTotal(this.rawData, this.planConfig);
  }

  readData(): void {
    this.dataSubscription?.unsubscribe();
    this.dataSubscription = this.authService.user$
      .pipe(
        filter(Boolean),
        switchMap((user) => this.budgetsFacadeService.readData(this.sourcePath, user.uid)),
        takeUntil(this.destroy$),
      )
      .subscribe((data: fromModels.DataEntry[]) => this.formData(data));
  }

  private setCommonDataLables(): void {
    this.budgetsFacadeService.setCommonDataLables();
  }

  private formData(data: fromModels.DataEntry[]): void {
    this.rawData = data;
    this.dataSource = this.budgetsFacadeService.formData(data, this.planConfig);
    setTimeout(() => {
      this.isLoading = false;
    });
  }

  private get planConfig(): fromModels.PlanConfig {
    return { year: this.year ?? '', type: this.planType ?? '' };
  }

  private handleOnYearChange(year: string) {
    this.year = year;
    this.sourcePath = `${year}/entries`;
    this.isLoading = true;
    this.setCommonDataLables();
    this.readData();
  }
}
