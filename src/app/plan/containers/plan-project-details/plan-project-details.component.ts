import { Component, HostListener, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";

import * as config from "../../plan.config";
import { DataProperty } from "../../plan.enum";
import * as model from "../../plan.model";
import { PlanHttpService } from "@home-budget/plan/services/plan-http.service";
import { PlanService } from "@home-budget/plan/services/plan.service";

@Component({
  selector: "hb-plan-project-details",
  templateUrl: "./plan-project-details.component.html",
  styleUrls: ["./plan-project-details.component.scss"],
})
export class PlanProjectDetailsComponent implements OnInit {
  public dataColumns: string[] = [];
  public dataLabels: { [key: string]: string };
  public dataSource: any = [];
  public displayedColumns: string[] = [];
  public form: FormGroup;
  public isLoading: boolean;
  public month: string;
  public path: string;

  private storageItem: any;
  private transactionType: string;
  private readonly planType: model.Item = config.planType[DataProperty.project];
  private readonly planYear: string = "2023";

  constructor(
    public dialog: MatDialog,
    private readonly planHttpService: PlanHttpService,
    private readonly planService: PlanService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  @HostListener("window:popstate", ["$event"])
  onPopState(event) {
    this.displayedColumns = [];
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params: model.GoToDetails) => {
      this.transactionType = params.type;
      this.path = params.path;

      this.setSummaryData();
      this.setBreadcrumbsState();
    });
  }

  public goToDetails(event: any): void {
    const dataItem = this.planService.getDataItem(
      event.path + ".entries." + event.category
    );

    if (dataItem["entries"]) {
      this.displayedColumns = [];
      this.router.navigate(["./plan/details"], {
        queryParams: {
          path: event.path + ".entries." + event.category,
        },
      });
    }
    // setTimeout(() => {
    //   window.location.reload();
    // }, 100);

    // const dialogRef = this.dialog.open(PlanProjectDetailsFormComponent, {
    //   data: {
    //     category: event.category,
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

  private setSummaryData(): void {
    this.planHttpService.readDataByType(this.path).subscribe((data) => {
      const dataEntries = data[0];
      this.dataSource = [];
      this.dataColumns = [];

      this.planService.setDataLabelsAndColumns(dataEntries);
      this.dataLabels = this.planService.dataLabels;
      this.dataColumns = this.planService.dataColumns;

      Object.keys(dataEntries)
        .filter((entry: any) => entry !== "key")
        .forEach((entry: string) => {
          const month: string = dataEntries[entry].label;
          const order: number = dataEntries[entry].order;
          const path: string = dataEntries[entry].path;
          const total: string = dataEntries[entry].total;

          let dataItem = {
            month,
            monthId: entry,
            order,
            path,
            total,
          };

          Object.keys(dataEntries[entry].entries || {}).forEach(
            (entryEntry: string) => {
              dataItem = {
                ...dataItem,
                [entryEntry]: {
                  total: dataEntries[entry].entries[entryEntry].total,
                },
              };
            }
          );
          this.dataSource.push(dataItem);
        });

      this.dataSource = this.dataSource.sort(
        (first: any, last: any) => first.order - last.order
      );
      this.setDisplayedColumns();
    });
  }

  private setBreadcrumbsState(): void {
    const labels = {
      ...this.planService.dataLabels,
      project: "Projekt",
      execution: "Wykonanie",
      incomes: "Przychody",
      expenses: "Wydatki",
    };

    const searchRegExp = /.entries/gi;
    const replaceWith = "";

    const breadCrumbs: string[] = this.path
      .split("/")
      .join(".")
      .replace(searchRegExp, replaceWith)
      .split(".");

    const breadCrumbItems: string[] = breadCrumbs
      .filter((breadCrumb: string, index: number) => index > 0)
      .filter((breadCrumb: string) => breadCrumb.length)
      .map((breadCrumb: string) => {
        return labels[breadCrumb];
      });

    setTimeout(() => {
      this.planService.setBreadcrumbsState(breadCrumbItems);
    });
  }

  private submit(category: string): void {
    if (this.form.invalid) {
      return;
    }
    const currentStorage = JSON.parse(localStorage.getItem("plan"));
    const value = this.form.value;
    const data = {
      ...currentStorage,
      "2023": {
        project: {
          ...currentStorage["2023"].project,
          [this.month]: {
            ...currentStorage["2023"].project[this.month],
            entries: {
              ...currentStorage["2023"].project[this.month].entries,
              [this.transactionType]: {
                ...currentStorage["2023"].project[this.month].entries[
                  this.transactionType
                ],
                entries: {
                  ...currentStorage["2023"].project[this.month].entries[
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
    localStorage.setItem("plan", JSON.stringify(data));
    this.storageItem = JSON.parse(localStorage.getItem("plan"));
    this.setSummaryData();
  }
}
