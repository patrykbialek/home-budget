import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';

import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { BudgetsFacadeService } from '@budgets/services/budgets-facade.service';

import * as fromModels from '@budgets/models';
import * as config from '@budgets/shared/budgets.config';
import { SharedUtilsService } from '@shared/services/shared-utils.service';
import { CoreService } from '@home-budget/core/core.service';

@Component({
  selector: 'hb-budget-summary',
  templateUrl: './budget-summary.component.html',
  styleUrls: ['./budget-summary.component.scss'],
})
export class BudgetSummaryComponent implements OnDestroy {
  displayedColumns: string[] = config.planColumns;
  dataSource: fromModels.DataSourceSummary[] = config.defaultDataSource;
  isLoading: boolean;

  year$ = this.coreService.year$
    .pipe(tap(console.log))
    .pipe(tap((year: string) => this.handleOnYearChange(year)));

  private planType: string;
  private subscription$: Subscription = new Subscription();

  private readonly main: string = 'budgets';
  private year: string;
  private sourcePath: string;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly budgetsFacadeService: BudgetsFacadeService,
    private readonly router: Router,
    private readonly sharedUtilsService: SharedUtilsService,
    private readonly coreService: CoreService,
  ) { }

  private handleOnYearChange(year: string) {
    this.year = year;
    this.sourcePath = `${year}/entries`;
    this.isLoading = true;
    this.setCommonDataLables();
    this.setPlanType();
    this.readData();
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
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

  readData(): void {
    this.subscription$.add(
      this.budgetsFacadeService.readData(this.sourcePath)
        .subscribe((data: fromModels.DataEntry[]) => this.formData(data))
    );
  }

  private setCommonDataLables(): void {
    this.budgetsFacadeService.setCommonDataLables();
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
    this.dataSource = this.budgetsFacadeService.formData(data, this.planConfig);
    setTimeout(() => {
      this.isLoading = false;
    });
  }

  private get planConfig(): fromModels.PlanConfig {
    return { year: this.year, type: this.planType };
  }
}
