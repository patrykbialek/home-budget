import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  output,
} from '@angular/core';
import * as fromModels from '@home-budget/finance/models';

@Component({
  selector: 'hb-finance-details-data',
  templateUrl: './finance-details-data.component.html',
  styleUrls: ['./finance-details-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class FinanceDetailsDataComponent {
  dataLabels = input.required<fromModels.DataLabels>();
  dataSource = input.required<fromModels.DataSourceDetails[]>();
  dataSourceFooter = input.required<fromModels.DataSourceDetails>();
  displayedColumns = input.required<string[]>();
  isLoading = input.required<boolean>();

  editFinanceEntry = output<fromModels.FinanceEntry>();
  goToDetails = output<fromModels.FinanceEntry>();

  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
  }

  onGoToDetails(element: fromModels.DataSourceDetails, elementValue: fromModels.DataSourceDetailsEntry): void {
    let entry: string;
    Object.keys(element).forEach((key: string) => {
      if (element[key] === elementValue) {
        entry = key;
      }
    });
    const financeEntry: fromModels.FinanceEntry = {
      entry,
      hasEntries: elementValue.hasEntries,
      isInTotal: elementValue.isInTotal,
      label: elementValue.label,
      month: element.month,
      notes: elementValue.notes,
      order: elementValue.order,
      path: element.path,
      total: elementValue.total,
    };

    elementValue.hasEntries
      ? this.goToDetails.emit(financeEntry)
      : this.editFinanceEntry.emit(financeEntry);
  }

  onEditFinanceEntry(element: fromModels.DataSourceDetails, elementValue: fromModels.DataSourceDetailsEntry): void {
    let entry: string;
    Object.keys(element).forEach((key: string) => {
      if (element[key] === elementValue) {
        entry = key;
      }
    });
    const financeEntry: fromModels.FinanceEntry = {
      entry,
      hasEntries: elementValue.hasEntries,
      isInTotal: elementValue.isInTotal,
      label: elementValue.label,
      month: element.month,
      notes: elementValue.notes,
      order: elementValue.order,
      path: element.path,
      total: elementValue.total,
    };

    this.editFinanceEntry.emit(financeEntry);
  }
}
