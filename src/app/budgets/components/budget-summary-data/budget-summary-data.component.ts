import { Component, input, output } from '@angular/core';

import * as fromModels from '@budgets/models';

@Component({
  selector: 'hb-budget-summary-data',
  templateUrl: './budget-summary-data.component.html',
  styleUrls: ['./budget-summary-data.component.scss'],
  standalone: false
})
export class BudgetSummaryDataComponent {
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
