import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataProperty } from '@home-budget/plans/plans.enum';
import { Subscription } from 'rxjs';

import * as config from '../../plans.config';
import * as model from '../../plans.model';
import { PlanService } from '../../services/plan.service';

@Component({
  selector: 'hb-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss'],
})
export class PlanComponent implements OnDestroy, OnInit {
  public displayedColumns: string[] = config.planColumns;
  public dataSource: model.DataSourceSummary[] = config.defaultDataSource;
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

  public goToDetails(event: model.GoToDetails): void {
    this.router.navigate([`./${this.main}/${this.planType}/details`], {
      queryParams: {
        path: `${event.path}`,
        type: event.type,
      },
    });
  }

  public get dataLabels(): model.DataLabels {
    return this.planService.dataLabels;
  }

  public readData(): void {
    const sourcePath: string = `${this.year}/entries`;
    this.subscription$.add(
      this.planService.readData(sourcePath)
        .subscribe((data: model.DataEntry[]) => this.formData(data))
    );
  }

  private setCommonDataLables(): void {
    this.planService.setCommonDataLables();
  }

  private setPlanType(): void {
    this.activatedRoute.url
      .subscribe((response: any) => this.planType = response[0].path);
  }

  private formData(data?: model.DataEntry[]): void {
    this.dataSource = data
      .map((entry: model.DataEntry) => {
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
      .sort((first: model.DataSourceSummary, last: model.DataSourceSummary) => first.order - last.order)
      .map((entry: model.DataSourceSummary) => {
        delete entry.order;
        return {
          ...entry,
          rest: entry.incomes - entry.expenses,
        };
      })
      .reduce((array: model.DataSourceSummary[], entity: model.DataSourceSummary, index: number) => {
        const currentEntity: model.DataSourceSummary = { ...entity };
        const previousEntity: model.DataSourceSummary = array[index - 1];
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

  private calculateTotal(data: model.DataEntryPlanEntry): number {
    let total: number = 0;
    Object.keys(data)
      .forEach((key: string) => total += data[key].total);
    return total;
  }

  private formEntry(entry: model.DataEntry, node: string): model.DataEntryPlanEntry {
    return entry.entries[this.planType].entries[node].entries;
  }

  private formDataSourceTotal(): void {
    this.total = this.dataSource.reduce(
      (previousValue: number, entity: model.DataSourceSummary) => {
        return previousValue + entity.rest;
      },
      0
    );
  }
}
