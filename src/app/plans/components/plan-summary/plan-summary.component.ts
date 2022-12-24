import { Component, EventEmitter, Input, Output } from '@angular/core';

import * as model from '../../plans.model';

@Component({
  selector: 'hb-plan-summary',
  templateUrl: './plan-summary.component.html',
  styleUrls: ['./plan-summary.component.scss']
})
export class PlanSummaryComponent {

  @Input() public readonly dataLabels: { [key: string]: string; };
  @Input() public readonly dataSource: any[];
  @Input() public readonly displayedColumns: string[];
  @Input() public readonly total: number;
  @Input() public readonly isLoading: boolean;

  @Output() public goToDetails: EventEmitter<model.GoToDetails> = new EventEmitter();

  public onGoToDetails(element: any, type: string): void {
    const path: string = element.path;
    this.goToDetails.emit({ type, path, month: element.monthId });
  }
}
