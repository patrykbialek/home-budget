import { Component, input, output } from '@angular/core';

import * as fromModels from '@home-budget/plans/models';

@Component({
  selector: 'hb-plan-summary-data',
  templateUrl: './plan-summary-data.component.html',
  styleUrls: ['./plan-summary-data.component.scss'],
  standalone: false
})
export class PlanSummaryDataComponent {
  dataLabels = input.required<{ [key: string]: string; }>();
  dataSource = input.required<fromModels.DataSourceSummary[]>();
  dataSourceTotal = input<number>(0);
  dataSourceProjectTotal = input<number>(0);
  isExecutionTab = input<boolean>(false);
  displayedColumns = input.required<string[]>();
  isLoading = input.required<boolean>();

  goToDetails = output<fromModels.QueryParamsResponse>();

  onGoToDetails(element: fromModels.DataSourceSummary, type: string): void {
    const month: string = element.month;
    const path: string = element.path;
    this.goToDetails.emit({ month, path, type, });
  }
}
