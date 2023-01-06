import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataProperty } from '@home-budget/plans/models/plans.enum';
import { Subscription } from 'rxjs';

import * as config from '../../shared/plans.config';
import * as fromModels from '@home-budget/plans/models';
import { PlanService } from '../../services/plan.service';

@Component({
  selector: 'hb-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss'],
})
export class PlanComponent implements OnDestroy, OnInit {
  public displayedColumns: string[] = config.planColumns;
  public dataSource: fromModels.DataSourceSummary[] = config.defaultDataSource;
  public isLoading: boolean;
  public total: number = 0;

  private planType: string;
  private subscription$: Subscription = new Subscription();
  private readonly main: string = 'plans';
  private readonly year: string = '2023';

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly planService: PlanService,
    private readonly router: Router,
  ) { }

  public ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  public ngOnInit(): void {
    this.isLoading = true;
    this.setCommonDataLables();
    this.setPlanType();
    this.readData();
  }

  public goToDetails(event: any): void {
    this.router.navigate([`./${this.main}/${this.planType}/details`], {
      queryParams: {
        path: `${event.path}`,
        type: event.type,
      },
    });
  }

  public get dataLabels(): fromModels.DataLabels {
    return this.planService.dataLabels;
  }

  public readData(): void {
    const sourcePath: string = `${this.year}/entries`;
    this.subscription$.add(
      this.planService.readData(sourcePath)
        .subscribe((data: fromModels.DataEntry[]) => this.formData(data))
    );
  }

  private setCommonDataLables(): void {
    this.planService.setCommonDataLables();
  }

  private setPlanType(): void {
    this.activatedRoute.url
      .subscribe((response: any) => this.planType = response[0].path);
  }

  private formData(data?: fromModels.DataEntry[]): void {
    this.dataSource = data
      .map((entry: fromModels.DataEntry) => {
        const expenses: number = this.calculateTotal(
          this.formEntry(entry, DataProperty.expenses)
        );
        const incomes: number = this.calculateTotal(
          this.formEntry(entry, DataProperty.incomes)
        );

        return {
          expenses,
          incomes,
          increase: 0,
          month: entry.key,
          order: entry.order,
          path: `${this.year}/entries/month/entries/${this.planType}`,
          rest: 0,
        };
      })
      .sort((first: fromModels.DataSourceSummary, last: fromModels.DataSourceSummary) => first.order - last.order)
      .map((entry: fromModels.DataSourceSummary) => {
        delete entry.order;
        return {
          ...entry,
          rest: entry.incomes - entry.expenses,
        };
      })
      .reduce((array: fromModels.DataSourceSummary[], entity: fromModels.DataSourceSummary, index: number) => {
        const currentEntity: fromModels.DataSourceSummary = { ...entity };
        const previousEntity: fromModels.DataSourceSummary = array[index - 1];
        currentEntity.increase =
          index === 0
            ? currentEntity.rest
            : previousEntity.increase + currentEntity.rest;
        array.push(currentEntity);
        return array;
      }, []);

    setTimeout(() => {
      this.isLoading = false;
      this.formDataSourceTotal();
    });
  }

  private calculateTotal(data: fromModels.DataEntryPlanEntry): number {
    let total: number = 0;
    Object.keys(data)
      .forEach((key: string) => total += data[key].total);
    return total;
  }

  private formEntry(entry: fromModels.DataEntry, node: string): fromModels.DataEntryPlanEntry {
    return entry.entries[this.planType].entries[node].entries;
  }

  private formDataSourceTotal(): void {
    this.total = this.dataSource.reduce(
      (previousValue: number, entity: fromModels.DataSourceSummary) => {
        return previousValue + entity.rest;
      },
      0
    );
  }
}
