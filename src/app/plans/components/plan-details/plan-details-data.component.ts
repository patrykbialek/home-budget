import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  output,
} from '@angular/core';
import * as fromModels from '@home-budget/plans/models';

@Component({
  selector: 'hb-plan-details-data',
  templateUrl: './plan-details-data.component.html',
  styleUrls: ['./plan-details-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PlanDetailsDataComponent {
  dataLabels = input.required<fromModels.DataLabels>();
  dataSource = input.required<fromModels.DataSourceDetails[]>();
  dataSourceFooter = input.required<fromModels.DataSourceDetails>();
  displayedColumns = input.required<string[]>();
  isLoading = input.required<boolean>();

  editPlanEntry = output<fromModels.PlanEntry>();
  goToDetails = output<fromModels.PlanEntry>();

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
    const planEntry: fromModels.PlanEntry = {
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
      ? this.goToDetails.emit(planEntry)
      : this.editPlanEntry.emit(planEntry);
  }

  onEditPlanEntry(element: fromModels.DataSourceDetails, elementValue: fromModels.DataSourceDetailsEntry): void {
    let entry: string;
    Object.keys(element).forEach((key: string) => {
      if (element[key] === elementValue) {
        entry = key;
      }
    });
    const planEntry: fromModels.PlanEntry = {
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

    this.editPlanEntry.emit(planEntry);
  }
}
