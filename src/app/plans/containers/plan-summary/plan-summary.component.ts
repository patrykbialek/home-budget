import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';

import * as config from '../../shared/plans.config';
import * as fromModels from '@home-budget/plans/models';
import { PlansFacadeService } from '../../services/plans-facade.service';
import { AuthenticationFacadeService } from '@authentication/store';

import * as fromAuthModels from '@home-budget/authentication/models';
import { CoreService } from '@home-budget/core/core.service';

@Component({
  selector: 'hb-plan-summary',
  templateUrl: './plan-summary.component.html',
  styleUrls: ['./plan-summary.component.scss'],
  standalone: false
})
export class PlanSummaryComponent implements OnDestroy, OnInit {
  displayedColumns: string[] = config.planColumns;
  dataSource: fromModels.DataSourceSummary[] = config.defaultDataSource;
  isLoading = false;

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly authService = inject(AuthenticationFacadeService);
  private readonly coreService = inject(CoreService);
  private readonly plansFacadeService = inject(PlansFacadeService);
  private readonly router = inject(Router);

  year$ = this.coreService.year$
    .pipe(
      tap((year: string) => this.handleOnYearChange(year)),
    );

  private planType: string | undefined;
  private readonly destroy$ = new Subject<void>();
  private dataSubscription: Subscription | undefined;

  private readonly main: string = 'plans';
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
    this.router.navigate([`./${this.main}/${this.planType}/details`], {
      queryParams: {
        path: `${event.path}`,
        type: event.type,
      },
    });
  }

  get dataLabels(): fromModels.DataLabels {
    return this.plansFacadeService.dataLabels;
  }

  get dataSourceTotal(): number {
    return this.dataSource.reduce(
      (previousValue: number, entity: fromModels.DataSourceSummary) => {
        return previousValue + entity.rest;
      },
      0
    );
  }

  readData(): void {
    this.dataSubscription?.unsubscribe();
    this.dataSubscription = this.authService.user$
      .pipe(
        map((response: fromAuthModels.User) => response.uid),
        switchMap(() => this.plansFacadeService.readData(this.sourcePath)),
        takeUntil(this.destroy$),
      )
      .subscribe((data: fromModels.DataEntry[]) => this.formData(data));
  }

  private setCommonDataLables(): void {
    this.plansFacadeService.setCommonDataLables();
  }

  private formData(data: fromModels.DataEntry[]): void {
    this.dataSource = this.plansFacadeService.formData(data, this.planConfig);
    setTimeout(() => {
      this.isLoading = false;
    });
  }

  private get planConfig(): fromModels.PlanConfig {
    return { year: this.year ?? '', type: this.planType ?? '' };
  }

  private handleOnYearChange(year: string) {
    this.isLoading = true;
    this.year = year;
    this.sourcePath = `${this.year}/entries`;
    this.setCommonDataLables();
    this.readData();
  }
}
