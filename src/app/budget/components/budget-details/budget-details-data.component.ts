import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  output,
} from '@angular/core';
import * as fromModels from '@home-budget/budget/models';

@Component({
  selector: 'hb-budget-details-data',
  templateUrl: './budget-details-data.component.html',
  styleUrls: ['./budget-details-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class BudgetDetailsDataComponent {
  dataLabels = input.required<fromModels.DataLabels>();
  dataSource = input.required<fromModels.DataSourceDetails[]>();
  dataSourceFooter = input.required<fromModels.DataSourceDetails>();
  displayedColumns = input.required<string[]>();
  isLoading = input.required<boolean>();

  editBudgetEntry = output<fromModels.BudgetEntry>();
  goToDetails = output<fromModels.BudgetEntry>();

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
    const budgetEntry: fromModels.BudgetEntry = {
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
      ? this.goToDetails.emit(budgetEntry)
      : this.editBudgetEntry.emit(budgetEntry);
  }

  onEditBudgetEntry(element: fromModels.DataSourceDetails, elementValue: fromModels.DataSourceDetailsEntry): void {
    let entry: string;
    Object.keys(element).forEach((key: string) => {
      if (element[key] === elementValue) {
        entry = key;
      }
    });
    const budgetEntry: fromModels.BudgetEntry = {
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

    this.editBudgetEntry.emit(budgetEntry);
  }
}
