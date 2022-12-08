import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'hb-plan-project-details-summary',
  templateUrl: './plan-project-details-summary.component.html',
  styleUrls: ['./plan-project-details-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanProjectDetailsSummaryComponent {

  @Input() public dataSource: any;
  @Input() public displayedColumns: string[];
  @Output() public goToDetails: EventEmitter<any> = new EventEmitter();

  public onGoToDetails(element: any, value: number): void {
    let category: string;
    Object.keys(element).forEach((key: string) => {
      if (element[key] === value) {
        category = key;
      }
    });
    const event = {
      category,
      type: element.type,
      month: element.month,
      monthLabel: element.monthLabel,
    };
    this.goToDetails.emit(event);
  }
}
