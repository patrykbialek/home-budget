import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PlanService } from '@home-budget/plan/plan.service';

import * as config from '../../plan.config';
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
  public monthId: string;

  public dataSource: any = [];
  public displayedColumns: string[] = [];

  private item: any;
  private storageItem: any;
  private planType: model.Item = config.planType['project'];
  private planYear: string = '2023';
  private transactionType: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly planService: PlanService,
  ) { }

  public ngOnInit(): void {
    this.route.queryParams
      .subscribe((params: model.GoToDetails) => {
        this.monthId = params.monthId;
        this.transactionType = params.transactionType;
        this.storageItem = JSON.parse(localStorage.getItem('plan'));
        this.item = this.storageItem[this.planYear][this.planType.id][params.monthId][params.transactionType];
        this.columns = Object.keys(this.item).map((item: string) => item);

        this.setDisplayedColumns();
        this.setData(params);
      });
  }

  private setDisplayedColumns(): void {
    this.displayedColumns.push('month');
    this.displayedColumns.push('total');
    this.displayedColumns = this.displayedColumns.concat(this.columns);
  }

  private setData(params: model.GoToDetails): void {
    this.setFormData(params);
    this.setSummaryData();
  }

  private setFormData(params: model.GoToDetails): void {
    this.form = new FormGroup({});

    Object.keys(this.item).forEach((income: string) => {
      const incomeGroup = new FormGroup({});

      incomeGroup.addControl('total', new FormControl(this.item[income].total));
      incomeGroup.addControl('entries', new FormArray([]));
      const entriesArray: FormArray = incomeGroup.get('entries') as FormArray;

      this.item[income]['entries'].forEach((entry: any) => {
        entriesArray.push(new FormGroup({
          isTotal: new FormControl(entry['isTotal'] || false),
          label: new FormControl(entry['label']),
          value: new FormControl(entry['value']),
        }));
      });

      this.form.addControl(income, incomeGroup);
    });
    this.subscribeToColumnFormChanes();
    this.setBreadcrumbsState(params);
  }

  private subscribeToColumnFormChanes(): void {
    this.columns.forEach((column: string) => {
      const columnFormArray: FormArray = this.getEntriesControl(column);
      if (!columnFormArray) {
        return;
      }

      columnFormArray.valueChanges
        .subscribe((item: any) => {
          let total: number = 0;
          item.forEach((entry: any) => {
            if (entry.isTotal) {
              total += parseFloat(entry.value || 0);
            }
          });

          this.getTotalControl(column).setValue(total);
        });
    });
  }

  private setSummaryData(): void {
    const items = this.storageItem[this.planYear][this.planType.id];
    Object.keys(items).forEach((item: string) => {
      let dataItem = { month: config.monthLabel[item].long, total: 0 };
      const dataType = items[item][this.transactionType];
      Object.keys(dataType).forEach((type: string)=>{
        dataItem = {
          ...dataItem,
          total: dataItem.total + dataType[type].total,
          [type]: dataType[type].total,
        }
      })
      this.dataSource.push(dataItem);
    });
  }

  private getEntriesControl(column: string): FormArray {
    return this.form.get(column).get('entries') as FormArray;
  }

  private getTotalControl(column: string): FormControl {
    return this.form.get(column).get('total') as FormControl;
  }

  private setBreadcrumbsState(params: model.GoToDetails): void {
    setTimeout(() => {
      this.planService.setBreadcrumbsState([
        this.planType.long,
        // config.monthLabel[params.monthId].long,
        config.transactionType[params.transactionType].long,
      ]);
    });
  }
}
