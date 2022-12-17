import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';

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
export class PlanProjectDetailsComponent implements OnDestroy, OnInit {
  public dataColumns: string[] = [];
  public dataSource: any = [];
  public displayedColumns: string[] = [];
  public form: FormGroup;
  public isLoading: boolean;
  public month: string;

  private isDataLoaded: boolean;
  private storageItem: any;
  private readonly planType: model.Item = config.planType[DataProperty.project];
  private readonly planYear: string = '2023';

  constructor(
    public dialog: MatDialog,
    private readonly planService: PlanService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) { }

  @HostListener('window:popstate', ['$event'])
  onPopState() {
    this.displayedColumns = [];
  }

  public ngOnDestroy(): void {
    this.planService.breadcrumbs = [];
  }

  public ngOnInit(): void {
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

  public get dataLabels(): DataLabels {
    return this.planService.dataLabels;
  }

  public get breadcrumbs(): any[] {
    return this.planService.breadcrumbs;
  }

  public goToDetails(event: any): void {
    if (event.isCurrent) {
      return;
    }
    if (event.router) {
      const queryParams = {
        type: event.router.type,
        path: event.router.path,
      };
      this.router.navigate([event.router.href], { queryParams });
      return;
    }

    const sourcePath = `${event.path}`;
    const months = this.planService.months;
    const subs$: Observable<any>[] = [];
    if (event.hasEntries) {
      this.formBreadcrumbs(event);

      const dataSource = [];
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

              dataSource.push(dataItem);
            }))
        )
      });

      combineLatest(subs$).subscribe(() => {
        this.dataSource = dataSource;
        this.dataColumns = [];
        this.displayedColumns = [];
        this.planService.setDataLabelsAndColumns(this.dataSource[0]);
        this.dataColumns = this.planService.dataColumns.filter((dataColumn: string) => dataColumn !== 'hasEntries');
        this.setDisplayedColumns();
      });

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
    // this.router.navigate(['./plan/details']);
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

  private formBreadcrumbs(event: any): void {
    this.planService.formBreadcrumbs(event);
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

  // private formData(data?: any): void {
  //   this.displayedColumns = ['month', 'total'];

  //   const currentPath: string = data[0].entries.project.entries[this.transactionType].path

  //   this.planService.formBreadcrumbs({
  //     path: currentPath,
  //     entry: 'project',
  //     router: {
  //       href: './plan/project',
  //     },
  //   });
  //   this.planService.formBreadcrumbs({
  //     path: currentPath,
  //     entry: this.transactionType,
  //     router: {
  //       href: './plan/details',
  //       path: this.path,
  //       type: this.transactionType,
  //     }
  //   });
  //   this.setBreadcrumbsState(currentPath);

  //   const entryData = this.formEntry(data[0], this.transactionType);
  //   Object.keys(entryData).forEach((key: string) => {
  //     this.displayedColumns.push(key);
  //     this.setDataLabel({ key, value: entryData[key].label })
  //   });

  //   const dataSource = data
  //     .map((entry: any) => {
  //       let dataItem = {
  //         month: entry.label,
  //         order: entry.order,
  //         path: `2023/entries/month/entries/project/entries/${this.transactionType}/entries`,
  //         total: 0,
  //       };

  //       const entryData = this.formEntry(entry, this.transactionType);
  //       let total = 0;
  //       Object.keys(entryData).forEach((key: string) => {
  //         total += entryData[key].total;
  //         dataItem = {
  //           ...dataItem,
  //           [key]: {
  //             total: entryData[key].total,
  //             hasEntries: Boolean(entryData[key].entries),
  //           },
  //           total,
  //         };
  //       });

  //       return dataItem;
  //     })
  //     .sort((first: any, last: any) => first.order - last.order)
  //     .map((entry: any) => {
  //       delete entry.order;
  //       return entry;
  //     });

  //   const totalDataItem = {
  //     month: '',
  //     total: 12300,
  //     expense01: 12300,
  //     expense02: 12300,
  //     expense03: 12300,
  //     expense04: 12300,
  //     expense05: 12300,
  //   };
  //   dataSource.push(totalDataItem);

  //   this.dataSource = dataSource;
  // }

  // private formEntry(entry: any, node: string): any {
  //   return entry.entries.project.entries[node].entries;
  // }

  // private formSummaryData(): void {
  //   const sourcePath: string = `2023/entries`;
  //   this.planService.readData(sourcePath).subscribe((data: any) => {
  //     this.formData(data);
  //   });
  // }

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

  private setDataLabel(label: DataLabel): void {
    this.planService.setDataLabel(label);
  }
}
