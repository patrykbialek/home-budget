import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import * as config from '../../plan.config';
import { DataProperty } from '../../plan.enum';
import * as model from '../../plan.model';
import { PlanHttpService } from '@home-budget/plan/services/plan-http.service';
import { DataLabel, DataLabels, PlanService } from '@home-budget/plan/services/plan.service';
import { PlanProjectDetailsFormComponent } from '@home-budget/plan/components';
import { combineLatest, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'hb-plan-project-details',
  templateUrl: './plan-project-details.component.html',
  styleUrls: ['./plan-project-details.component.scss'],
})
export class PlanProjectDetailsComponent implements OnInit {
  public dataColumns: string[] = [];
  public dataSource: any = [];
  public displayedColumns: string[] = [];
  public form: FormGroup;
  public isLoading: boolean;
  public month: string;
  public path: string;

  private storageItem: any;
  private transactionType: string;
  private readonly planType: model.Item = config.planType[DataProperty.project];
  private readonly planYear: string = '2023';

  constructor(
    public dialog: MatDialog,
    private readonly planService: PlanService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) { }

  @HostListener('window:popstate', ['$event'])
  onPopState() {
    this.displayedColumns = [];
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params: model.GoToDetails) => {
      this.transactionType = params.type;
      this.formSummaryData();
    });
  }

  public get dataLabels(): DataLabels {
    return this.planService.dataLabels;
  }

  public goToDetails(event: any): void {
    const sourcePath = `${event.path}`;
    const months = this.planService.months;
    const subs$: Observable<any>[] = [];
    if (event.hasEntries) {
      this.dataSource = []
      months.map((month: any, index: number) => {
        const path = sourcePath.replace('month', month.key);
        subs$.push(this.planService.readDataByType(path)
          .pipe(
            tap((entries: any[]) => {
              const foundEntry = entries.find(entry => entry.key === event.entry);
              let dataItem = {
                month: month.value,
                monthId: month.key,
                order: index,
                path: `${path}/${event.entry}/entries`,
                total: 0,
              };

              if (index === 11) {
                const dataLabel: DataLabel = {
                  key: foundEntry.key,
                  value: foundEntry.label
                };
                this.setDataLabel(dataLabel)
                const currentPath: string = `${path}/${foundEntry.key}`;
                this.setBreadcrumbsState(currentPath);
              }

              let total: number = 0;
              Object.keys(foundEntry.entries).forEach((key) => {
                total += foundEntry.entries[key].total;
                dataItem = {
                  ...dataItem,
                  [key]: {
                    total: foundEntry.entries[key].total,
                    label: foundEntry.entries[key].label,
                    hasEntries: Boolean(foundEntry.entries[key].entries),
                  },
                };
              });

              dataItem = {
                ...dataItem,
                total,
              };

              this.dataSource.push(dataItem);
            }))
        )
      });

      combineLatest(subs$).subscribe(() => {
        this.dataColumns = [];
        this.displayedColumns = [];
        this.planService.setDataLabelsAndColumns(this.dataSource[0]);
        this.dataColumns = this.planService.dataColumns.filter((dataColumn: string) => dataColumn !== 'hasEntries');
        this.setDisplayedColumns();
      })
    }

    // const dialogRef = this.dialog.open(PlanProjectDetailsFormComponent, {
    //   data: {
    //     category: event.entry,
    //     form: this.setFormData(event),
    //     monthLabel: event.monthLabel,
    //   },
    // });

    // dialogRef.afterClosed()
    //   .subscribe((result: { category: string, form: FormGroup; }) => {
    //     if (result && result.form) {
    //       this.form = result.form;
    //       this.submit(result.category);
    //     }
    //   });
  }

  private setDisplayedColumns(): void {
    this.displayedColumns.push(DataProperty.month);
    this.displayedColumns.push(DataProperty.total);
    this.displayedColumns = this.displayedColumns.concat([
      ...new Set(this.dataColumns),
    ]);
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

  private formData(data?: any): void {
    this.displayedColumns = ['month', 'total'];
    this.dataSource = [];

    const currentPath: string = data[0].entries.project.entries[this.transactionType].path
    this.setBreadcrumbsState(currentPath);

    const entryData = this.formEntry(data[0], this.transactionType);
    Object.keys(entryData).forEach((key: string) => {
      this.displayedColumns.push(key);
      this.setDataLabel({ key, value: entryData[key].label})
    });

    this.dataSource = data
      .map((entry: any) => {
        let dataItem = {
          month: entry.label,
          order: entry.order,
          path: `2023/entries/month/entries/project/entries/${this.transactionType}/entries`,
          total: 0,
        };

        const entryData = this.formEntry(entry, this.transactionType);
        let total = 0;
        Object.keys(entryData).forEach((key: string) => {
          total += entryData[key].total;
          dataItem = {
            ...dataItem,
            [key]: {
              total: entryData[key].total,
              hasEntries: Boolean(entryData[key].entries),
            },
            total,
          };
        });

        return dataItem;
      })
      .sort((first: any, last: any) => first.order - last.order)
      .map((entry: any) => {
        delete entry.order;
        return entry;
      });

    let totalDataItem = {
      month: '',
      total: 12300,
      expense01: 12300,
      expense02: 12300,
      expense03: 12300,
      expense04: 12300,
      expense05: 12300,
    };
    this.dataSource.push(totalDataItem);
  }

  private formEntry(entry: any, node: string): any {
    return entry.entries.project.entries[node].entries;
  }

  private formSummaryData(): void {
    const sourcePath: string = `2023/entries`;
    this.planService.readData(sourcePath).subscribe((data: any) => {
      this.formData(data);
    });
  }

  private setBreadcrumbsState(path: string): void {
    const searchRegExp = /.entries/gi;
    const replaceWith = '';
    const breadCrumbs: string[] = path
      .split('/')
      .join('.')
      .replace(searchRegExp, replaceWith)
      .replace('jan', '')
      .replace('dec', '')
      .split('.');

    const breadCrumbItems: string[] = breadCrumbs
      .filter((breadCrumb: string, index: number) => index > 0)
      .filter((breadCrumb: string) => breadCrumb.length)
      .map((breadCrumb: string) => {
        return this.dataLabels[breadCrumb];
      });

    setTimeout(() => {
      this.planService.setBreadcrumbsState(breadCrumbItems);
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
                ...currentStorage['2023'].project[this.month].entries[
                this.transactionType
                ],
                entries: {
                  ...currentStorage['2023'].project[this.month].entries[
                    this.transactionType
                  ].entries,
                  [category]: value,
                },
              },
            },
          },
        },
      },
    };
    localStorage.setItem('plan', JSON.stringify(data));
    this.storageItem = JSON.parse(localStorage.getItem('plan'));
    // this.setSummaryData();
  }

  private setDataLabel(label: DataLabel): void {
    this.planService.setDataLabel(label);
  }
}
