import { Component, inject, input, output } from '@angular/core';

import * as fromModels from '@home-budget/finance/models';
import { FINANCE_FEATURE_CONFIG } from '@home-budget/finance/finance-feature.config';

@Component({
  selector: 'hb-finance-summary-data',
  templateUrl: './finance-summary-data.component.html',
  styleUrls: ['./finance-summary-data.component.scss'],
  standalone: false
})
export class FinanceSummaryDataComponent {
  readonly i18nPrefix = inject(FINANCE_FEATURE_CONFIG).i18nPrefix;

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
