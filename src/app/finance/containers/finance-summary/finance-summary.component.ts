import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';

import { filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

import { AuthenticationFacadeService } from '@authentication/store';
import { CoreService } from '@home-budget/core/core.service';
import { DataEntry, DataLabels, DataSourceSummary, FinanceConfig, QueryParamsResponse } from '@home-budget/finance/models';
import { defaultDataSource, financeColumns } from '../../shared/finance.config';
import { FINANCE_FEATURE_CONFIG } from '@home-budget/finance/finance-feature.config';
import { FinanceFacadeService } from '../../services/finance-facade.service';
import { FinanceGraphComponent } from '../../components/finance-graph/finance-graph.component';
import { FinanceSummaryDataComponent } from '../../components/finance-summary-data/finance-summary-data.component';

@Component({
  selector: 'hb-finance-summary',
  templateUrl: './finance-summary.component.html',
  styleUrls: ['./finance-summary.component.scss'],
  imports: [MatCard, MatCardContent, FinanceSummaryDataComponent, FinanceGraphComponent, AsyncPipe]
})
export class FinanceSummaryComponent implements OnDestroy, OnInit {
  displayedColumns: string[] = financeColumns;
  dataSource: DataSourceSummary[] = defaultDataSource;
  isLoading = false;

  private rawData: DataEntry[] = [];

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly authService = inject(AuthenticationFacadeService);
  private readonly coreService = inject(CoreService);
  private readonly financeFacadeService = inject(FinanceFacadeService);
  private readonly router = inject(Router);

  year$ = this.coreService.year$
    .pipe(
      tap((year: string) => this.handleOnYearChange(year)),
    );

  private financeType: string | undefined;
  private readonly destroy$ = new Subject<void>();
  private dataSubscription: Subscription | undefined;

  private readonly main: string = inject(FINANCE_FEATURE_CONFIG).collection;
  private year: string | undefined;
  private sourcePath = '';

  ngOnInit(): void {
    this.activatedRoute.url.pipe(
      takeUntil(this.destroy$),
    ).subscribe((segments: UrlSegment[]) => {
      this.financeType = segments[0]?.path;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goToDetails(event: QueryParamsResponse): void {
    this.router.navigate(['/', this.year, this.main, this.financeType, 'details'], {
      queryParams: {
        path: `${event.path}`,
        type: event.type,
      },
    });
  }

  get dataLabels(): DataLabels {
    return this.financeFacadeService.dataLabels;
  }

  get dataSourceTotal(): number {
    return this.dataSource.reduce(
      (previousValue: number, entity: DataSourceSummary) => {
        return previousValue + entity.rest;
      },
      0
    );
  }

  get isExecutionTab(): boolean {
    return this.financeType === 'execution';
  }

  get dataSourceProjectTotal(): number {
    return this.financeFacadeService.formProjectTotal(this.rawData, this.financeConfig);
  }

  readData(): void {
    this.dataSubscription?.unsubscribe();
    this.dataSubscription = this.authService.user$
      .pipe(
        filter(Boolean),
        switchMap((user) => this.financeFacadeService.readData(this.sourcePath, user.uid)),
        takeUntil(this.destroy$),
      )
      .subscribe((data: DataEntry[]) => this.formData(data));
  }

  private setCommonDataLabels(): void {
    this.financeFacadeService.setCommonDataLabels();
  }

  private formData(data: DataEntry[]): void {
    this.rawData = data;
    this.dataSource = this.financeFacadeService.formData(data, this.financeConfig);
    setTimeout(() => {
      this.isLoading = false;
    });
  }

  private get financeConfig(): FinanceConfig {
    return { year: this.year ?? '', type: this.financeType ?? '' };
  }

  private handleOnYearChange(year: string) {
    this.isLoading = true;
    this.year = year;
    this.sourcePath = `${this.year}/entries`;
    this.setCommonDataLabels();
    this.readData();
  }
}
