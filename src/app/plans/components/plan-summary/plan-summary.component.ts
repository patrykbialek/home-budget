import { Component, EventEmitter, Input, Output } from '@angular/core';

import * as model from '../../plans.model';

@Component({
  selector: 'hb-plan-summary',
  templateUrl: './plan-summary.component.html',
  styleUrls: ['./plan-summary.component.scss']
})
export class PlanSummaryComponent {

  @Input() public readonly dataLabels: { [key: string]: string; };
  @Input() public readonly dataSource: model.PlanProject[];
  @Input() public readonly displayedColumns: string[];
  @Input() public readonly total: number;

  @Output() public goToDetails: EventEmitter<model.GoToDetails> = new EventEmitter();

  public onGoToDetails(element: model.PlanProject, type: string): void {
    const path: string = element.path;
    this.goToDetails.emit({ type, path, month: element.monthId });
  }
}
