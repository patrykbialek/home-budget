import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';

import * as config from '../../plan.config';
import { DataProperty } from '../../plan.enum';
import * as model from '../../plan.model';
import { combineLatest } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PlanService } from '@home-budget/plan/services/plan.service';

@Component({
  selector: 'hb-plan-project-details',
  templateUrl: './plan-project-details.component.html',
  styleUrls: ['./plan-project-details.component.scss'],
})
export class PlanProjectDetailsComponent implements OnDestroy, OnInit {
  public form: FormGroup;
  public isLoading: boolean;
  public month: string;

  private isDataLoaded: boolean;
  private storageItem: any;
  private readonly planType: model.Item = config.planType[DataProperty.project];
  private readonly planYear: string = '2023';

  constructor(
    public dialog: MatDialog,
    private readonly activatedRoute: ActivatedRoute,
    private readonly planService: PlanService,
    private readonly router: Router
  ) { }

  public ngOnDestroy(): void {
    this.planService.breadcrumbs = [];
  }

  public ngOnInit(): void {
    this.planService.setCommonDataLables();
    this.planService.setDefaultDataSource();

    combineLatest([
      this.activatedRoute.url,
      this.activatedRoute.queryParams,
    ])
      .subscribe((response) => {
        if (response && response[1].path) {
          this.addMainBreadcrumb(response[0][0].path);
          this.goToDetails(this.formMainEntry(response[1]));
          this.router.navigate([], { relativeTo: this.activatedRoute });
          this.isDataLoaded = true;
        } else if (!this.isDataLoaded) {
          this.router.navigate(['../'], { relativeTo: this.activatedRoute });
        }
      });
  }

  public get dataLabels(): model.DataLabels {
    return this.planService.dataLabels;
  }

  public get breadcrumbs(): any[] {
    return this.planService.breadcrumbs;
  }

  public get dataSource(): any[] {
    return this.planService.dataSource;
  }

  public get dataColumns(): any[] {
    return this.planService.dataColumns;
  }

  public get displayedColumns(): any[] {
    return this.planService.displayedColumns;
  }

  public goToDetails(event: any): void {
    this.planService.goToDetails(event);
  }

  private formMainEntry(params: any): any {
    return {
      entry: params.type,
      hasEntries: true,
      path: `${params.path}/entries`,
    }
  }

  private addMainBreadcrumb(entry: string): void {
    this.planService.formBreadcrumbs({
      entry,
      path: null,
      router: {
        href: `./plan/${entry}`,
      },
    });
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
