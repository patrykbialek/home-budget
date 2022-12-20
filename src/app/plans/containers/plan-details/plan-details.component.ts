import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router, UrlSegment } from '@angular/router';

import * as config from '../../plans.config';
import { DataProperty } from '../../plans.enum';
import * as model from '../../plans.model';
import { combineLatest } from 'rxjs';
import { BreadcrumbsItem } from '../plan-breadcrumbs/plan-breadcrumbs.model';
import { BreadcrumbsService } from '../../../plans/services/breadcrumbs.service';
import { PlanService } from '../../../plans/services/plan.service';

@Component({
  selector: 'hb-plan-details',
  templateUrl: './plan-details.component.html',
  styleUrls: ['./plan-details.component.scss'],
})
export class PlanDetailsComponent implements OnDestroy, OnInit {
  public form: FormGroup;
  public month: string;

  private isDataLoaded: boolean;
  private storageItem: any;
  private readonly planType: model.Item = config.planType[DataProperty.project];
  private readonly planYear: string = '2023';

  constructor(
    public dialog: MatDialog,
    private readonly activatedRoute: ActivatedRoute,
    private readonly breadcrumbsService: BreadcrumbsService,
    private readonly planService: PlanService,
    private readonly router: Router
  ) { }

  public ngOnDestroy(): void {
    this.breadcrumbsService.breadcrumbs = [];
  }

  public ngOnInit(): void {
    this.planService.setCommonDataLables();
    this.planService.setDefaultDataSource();
    this.subscribeToRouteChange();
  }

  public get dataLabels(): model.DataLabels {
    return this.planService.dataLabels;
  }

  public get breadcrumbs(): BreadcrumbsItem[] {
    return this.breadcrumbsService.breadcrumbs;
  }

  public get dataSource(): model.DataSourceDetails[] {
    return this.planService.dataSource;
  }

  public get dataColumns(): string[] {
    return this.planService.dataColumns;
  }

  public get displayedColumns(): string[] {
    return this.planService.displayedColumns;
  }

  public get isLoading(): boolean {
    return this.planService.isLoading;
  }

  public editPlanEntry(event: model.PlanEntry): void {
    this.planService.editPlanEntry(event);
  }

  public goToDetails(event: model.PlanEntry): void {
    this.planService.goToDetails(event);
  }

  private subscribeToRouteChange(): void {
    combineLatest([
      this.activatedRoute.url,
      this.activatedRoute.queryParams,
    ])
      .subscribe((response: [UrlSegment[], model.QueryParamsResponse]) => {
        if (response && response[1].path) {
          this.addMainBreadcrumb(response[0][0].path);
          this.goToDetails(this.formMainEntry(response[1]));
          this.router.navigate([], { relativeTo: this.activatedRoute });
          this.isDataLoaded = true;
          return;
        }

        if (!this.isDataLoaded) {
          this.router.navigate(['../'], { relativeTo: this.activatedRoute });
        }
      });
  }

  private formMainEntry(params: model.RouteParam): model.PlanEntry {
    return {
      entry: params.type,
      hasEntries: true,
      path: `${params.path}/entries`,
    };
  }

  private addMainBreadcrumb(entry: string): void {
    const planEntry: model.PlanEntry = {
      entry,
      label: this.dataLabels[entry],
      hasEntries: true,
      href: `./plans/${entry}`,
      isCurrent: false,
      path: null,
    };
    this.breadcrumbsService.formBreadcrumbs(planEntry, this.dataLabels);
  }

  private setFormData(event: any): FormGroup {
    const storageItem = this.storageItem;
    const items =
      storageItem[this.planYear][this.planType.id][event.month][
      DataProperty.entries
      ][event.type][DataProperty.entries][event.category];
    const form: FormGroup = new FormGroup({});
    const entriesArray: FormArray = new FormArray([]);
    this.month = event.month;

    items[DataProperty.entries].forEach((entry: any) => {
      entriesArray.push(
        new FormGroup({
          isInTotal: new FormControl(entry[DataProperty.isInTotal] || false),
          label: new FormControl(entry[DataProperty.label]),
          value: new FormControl(entry[DataProperty.value]),
        })
      );
    });

    form.addControl(
      DataProperty.total,
      new FormControl(items[DataProperty.total])
    );
    form.addControl(DataProperty.entries, entriesArray);
    return form;
  }

}
