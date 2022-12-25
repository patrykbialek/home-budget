import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { DataLabels, DataSourceDetails, DataSourceDetailsEntry, PlanEntry } from '../../../plans/plans.model';

@Component({
  selector: 'hb-plan-details-summary',
  templateUrl: './plan-details-summary.component.html',
  styleUrls: ['./plan-details-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanDetailsSummaryComponent {
  @Input() public readonly dataLabels: DataLabels;
  @Input() public readonly dataSource: DataSourceDetails[];
  @Input() public readonly dataSourceFooter: DataSourceDetails;
  @Input() public readonly displayedColumns: string[];
  @Input() public readonly isLoading: boolean;

  @Output() public editPlanEntry: EventEmitter<PlanEntry> = new EventEmitter();
  @Output() public goToDetails: EventEmitter<PlanEntry> = new EventEmitter();

  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
  }

  public onGoToDetails(element: DataSourceDetails, elementValue: DataSourceDetailsEntry): void {
    let entry: string;
    Object.keys(element).forEach((key: string) => {
      if (element[key] === elementValue) {
        entry = key;
      }
    });
    const planEntry: PlanEntry = {
      entry,
      hasEntries: elementValue.hasEntries,
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

  public onEditPlanEntry(element: DataSourceDetails, elementValue: DataSourceDetailsEntry): void {
    let entry: string;
    Object.keys(element).forEach((key: string) => {
      if (element[key] === elementValue) {
        entry = key;
      }
    });
    const planEntry: PlanEntry = {
      entry,
      hasEntries: elementValue.hasEntries,
      month: element.month,
      notes: elementValue.notes,
      order: elementValue.order,
      path: element.path,
      total: elementValue.total,
    };

    this.editPlanEntry.emit(planEntry);
  }
}
