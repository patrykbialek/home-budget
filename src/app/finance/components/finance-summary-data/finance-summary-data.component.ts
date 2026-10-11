import { Component, inject, input, output } from '@angular/core';

import { DataSourceSummary, QueryParamsResponse } from '@home-budget/finance/models';
import { FINANCE_FEATURE_CONFIG } from '@home-budget/finance/finance-feature.config';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { NgClass, DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'hb-finance-summary-data',
  templateUrl: './finance-summary-data.component.html',
  styleUrls: ['./finance-summary-data.component.scss'],
  imports: [MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, NgClass, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, DecimalPipe, TranslatePipe]
})
export class FinanceSummaryDataComponent {
  readonly i18nPrefix = inject(FINANCE_FEATURE_CONFIG).i18nPrefix;

  dataLabels = input.required<{ [key: string]: string; }>();
  dataSource = input.required<DataSourceSummary[]>();
  dataSourceTotal = input<number>(0);
  dataSourceProjectTotal = input<number>(0);
  isExecutionTab = input<boolean>(false);
  displayedColumns = input.required<string[]>();
  isLoading = input.required<boolean>();

  goToDetails = output<QueryParamsResponse>();

  onGoToDetails(element: DataSourceSummary, type: string): void {
    const month: string = element.month;
    const path: string = element.path;
    this.goToDetails.emit({ month, path, type, });
  }
}
