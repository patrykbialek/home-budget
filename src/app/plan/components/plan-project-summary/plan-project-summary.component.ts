import { Component, EventEmitter, Input, Output } from '@angular/core';

import * as model from '../../plan.model';

@Component({
  selector: 'hb-plan-project-summary',
  templateUrl: './plan-project-summary.component.html',
  styleUrls: ['./plan-project-summary.component.scss']
})
export class PlanProjectSummaryComponent {

  @Input() public readonly dataSource: model.PlanProject[];
  @Input() public readonly displayedColumns: string[];
  @Input() public readonly total: number;

  @Output() public goToDetails: EventEmitter<model.GoToDetails> = new EventEmitter();

  public onGoToDetails(element: model.PlanProject, type: string): void {
    const path: string = type === 'expenses'
      ? element.expensesPath
      : element.incomesPath;
    this.goToDetails.emit({ type, path, month: element.monthId });
  }
}
