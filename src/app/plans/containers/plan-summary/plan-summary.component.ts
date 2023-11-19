import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { Subscription } from 'rxjs';

import * as config from '../../shared/plans.config';
import * as fromModels from '@home-budget/plans/models';
import { PlansFacadeService } from '../../services/plans-facade.service';
import { AuthenticationFacadeService } from '@authentication/store';
import { map, switchMap, tap } from 'rxjs/operators';

import * as fromAuthModels from '@home-budget/authentication/models';
import { CoreService } from '@home-budget/core/core.service';

@Component({
  selector: 'hb-plan-summary',
  templateUrl: './plan-summary.component.html',
  styleUrls: ['./plan-summary.component.scss'],
})
export class PlanSummaryComponent implements OnDestroy, OnInit {
  displayedColumns: string[] = config.planColumns;
  dataSource: fromModels.DataSourceSummary[] = config.defaultDataSource;
  isLoading: boolean;

  year$ = this.coreService.year$
    .pipe(
      tap((year: string) => this.handleOnYearChange(year)),
    );

  private planType: string;
  private subscription$: Subscription = new Subscription();

  private readonly main: string = 'plans';
  private year: string;
  private sourcePath: string;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly authService: AuthenticationFacadeService,
    private readonly coreService: CoreService,
    private readonly plansFacadeService: PlansFacadeService,
    private readonly router: Router,
  ) { }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  ngOnInit(): void {

  }

  goToDetails(event: any): void {
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
    this.subscription$.add(
      this.authService.user$
        .pipe(
          map((response: fromAuthModels.User) => response.uid),
          switchMap((uid: string) => this.plansFacadeService.readData(this.sourcePath))
        )
        .subscribe((data: fromModels.DataEntry[]) => this.formData(data))
    );
  }

  private setCommonDataLables(): void {
    this.plansFacadeService.setCommonDataLables();
  }

  private setPlanType(): void {
    this.subscription$.add(
      this.activatedRoute.url
        .subscribe((response: UrlSegment[]) => {
          this.planType = response[0].path;
        })
    );
  }

  private formData(data: fromModels.DataEntry[]): void {
    this.dataSource = this.plansFacadeService.formData(data, this.planConfig);
    setTimeout(() => {
      this.isLoading = false;
    });
  }

  private get planConfig(): fromModels.PlanConfig {
    return { year: this.year, type: this.planType };
  }

  private handleOnYearChange(year: string) {
    this.isLoading = true;
    this.year = year;
    this.sourcePath = `${this.year}/entries`;
    this.setCommonDataLables();
    this.setPlanType();
    this.readData();
  }
}
