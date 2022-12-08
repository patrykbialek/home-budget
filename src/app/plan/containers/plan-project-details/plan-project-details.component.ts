import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanProjectDetailsFormComponent } from '@home-budget/plan/components';
import { PlanService } from '@home-budget/plan/plan.service';

import * as config from '../../plan.config';
import { DataProperty } from '../../plan.enum';
import * as model from '../../plan.model';

@Component({
  selector: 'hb-plan-project-details',
  templateUrl: './plan-project-details.component.html',
  styleUrls: ['./plan-project-details.component.scss']
})
export class PlanProjectDetailsComponent implements OnInit {

  public columns: string[] = [];
  public form: FormGroup;
  public isLoading: boolean;
  public month: string;

  public dataSource: any = [];
  public displayedColumns: string[] = [];

  private item: any;
  private storageItem: any;
  private transactionType: string;
  private readonly planType: model.Item = config.planType[DataProperty.project];
  private readonly planYear: string = '2023';

  constructor(
    public dialog: MatDialog,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly planService: PlanService,
  ) { }

  public ngOnInit(): void {
    this.route.queryParams
      .subscribe((params: model.GoToDetails) => {
        this.transactionType = params.type;
        this.storageItem = JSON.parse(localStorage.getItem('plan'));
        const firstItem: any = this.storageItem[this.planYear][this.planType.id]['jan'][DataProperty.entries][params.type][DataProperty.entries];
        this.columns = Object.keys(firstItem).map((item: string) => item);

        this.setDisplayedColumns();
        this.setSummaryData();
        this.setBreadcrumbsState(params);
      });
  }

  public goToDetails(event: any): void {
    const dialogRef = this.dialog.open(PlanProjectDetailsFormComponent, {
      data: {
        category: event.category,
        form: this.setFormData(event),
        monthLabel: event.monthLabel,
      },
    });

    dialogRef.afterClosed()
      .subscribe((result: { category: string, form: FormGroup; }) => {
        if (result && result.form) {
          this.form = result.form;
          this.submit(result.category);
        }
      });
  }

  private setDisplayedColumns(): void {
    this.displayedColumns.push(DataProperty.monthLabel);
    this.displayedColumns.push(DataProperty.total);
    this.displayedColumns = this.displayedColumns.concat(this.columns);
  }

  private setFormData(event: any): FormGroup {
    const storageItem = this.storageItem;
    const items = storageItem[this.planYear][this.planType.id][event.month][DataProperty.entries][event.type][DataProperty.entries][event.category];
    const form: FormGroup = new FormGroup({});
    const entriesArray: FormArray = new FormArray([]);
    this.month = event.month;

    items[DataProperty.entries].forEach((entry: any) => {
      entriesArray.push(new FormGroup({
        isInTotal: new FormControl(entry[DataProperty.isInTotal] || false),
        label: new FormControl(entry[DataProperty.label]),
        value: new FormControl(entry[DataProperty.value]),
      }));
    });

    form.addControl(DataProperty.total, new FormControl(items[DataProperty.total]));
    form.addControl(DataProperty.entries, entriesArray);
    return form;
  }

  private setSummaryData(): void {
    this.dataSource = [];
    const items = this.storageItem[this.planYear][this.planType.id];
    Object.keys(items).forEach((item: string) => {
      let dataItem = { monthLabel: items[item].label, month: item, total: 0 };
      const dataType = items[item][DataProperty.entries][this.transactionType][DataProperty.entries];
      Object.keys(dataType).forEach((type: string) => {
        dataItem = {
          ...dataItem,
          total: dataItem.total + dataType[type].total,
          type: this.transactionType,
          [type]: dataType[type].total,
        };
      });
      this.dataSource.push(dataItem);
    });
  }

  private setBreadcrumbsState(params: model.GoToDetails): void {
    setTimeout(() => {
      this.planService.setBreadcrumbsState([
        this.planType.long,
        // config.monthLabel[params.monthId].long,
        config.transactionType[params.type].long,
      ]);
    });
  }

  private submit(category: string): void {
    if (this.form.invalid) {
      return;
    }
    const currentStorage = JSON.parse(localStorage.getItem('plan'));
    const value = this.form.value;
    const data = {
      ...currentStorage,
      '2023': {
        project: {
          ...currentStorage['2023'].project,
          [this.month]: {
            ...currentStorage['2023'].project[this.month],
            entries: {
              ...currentStorage['2023'].project[this.month].entries,
              [this.transactionType]: {
                ...currentStorage['2023'].project[this.month].entries[this.transactionType],
                entries: {
                  ...currentStorage['2023'].project[this.month].entries[this.transactionType].entries,
                  [category]: value,
                }
              }
            }
          },
        }
      }
    };
    localStorage.setItem('plan', JSON.stringify(data));
    this.storageItem = JSON.parse(localStorage.getItem('plan'));
    this.setSummaryData();
  }
}
