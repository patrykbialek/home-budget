import { Component, EventEmitter, Input, Output } from '@angular/core';

import * as fromModels from '@budgets/models';

@Component({
  selector: 'hb-budget-summary-data',
  templateUrl: './budget-summary-data.component.html',
  styleUrls: ['./budget-summary-data.component.scss']
})
export class BudgetSummaryDataComponent {

  @Input() public readonly dataLabels: { [key: string]: string; };
  @Input() public readonly dataSource: fromModels.DataSourceSummary[];
  @Input() public readonly dataSourceTotal: number = 0;
  @Input() public readonly displayedColumns: string[];
  @Input() public readonly isLoading: boolean;

  @Output() public goToDetails: EventEmitter<fromModels.QueryParamsResponse> = new EventEmitter();

  public onGoToDetails(element: fromModels.DataSourceSummary, type: string): void {
    const month: string = element.month;
    const path: string = element.path;
    this.goToDetails.emit({ month, path, type, });
  }
}
