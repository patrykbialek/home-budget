import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import * as fromModels from '@home-budget/plans/models';

@Component({
  selector: 'hb-plan-details-summary',
  templateUrl: './plan-details-summary.component.html',
  styleUrls: ['./plan-details-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanDetailsSummaryComponent {
  @Input() public readonly dataLabels: fromModels.DataLabels;
  @Input() public readonly dataSource: fromModels.DataSourceDetails[];
  @Input() public readonly dataSourceFooter: fromModels.DataSourceDetails;
  @Input() public readonly displayedColumns: string[];
  @Input() public readonly isLoading: boolean;

  @Output() public editPlanEntry: EventEmitter<fromModels.PlanEntry> = new EventEmitter();
  @Output() public goToDetails: EventEmitter<fromModels.PlanEntry> = new EventEmitter();

  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
  }

  public onGoToDetails(element: fromModels.DataSourceDetails, elementValue: fromModels.DataSourceDetailsEntry): void {
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

  public onEditPlanEntry(element: fromModels.DataSourceDetails, elementValue: fromModels.DataSourceDetailsEntry): void {
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
      month: element.month,
      notes: elementValue.notes,
      order: elementValue.order,
      path: element.path,
      total: elementValue.total,
    };

    this.editPlanEntry.emit(planEntry);
  }
}
