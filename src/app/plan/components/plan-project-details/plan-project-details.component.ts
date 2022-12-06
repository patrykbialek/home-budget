import { Component, Input } from '@angular/core';

import * as model from '../../plan.model';

@Component({
  selector: 'hb-plan-project-details',
  templateUrl: './plan-project-details.component.html',
  styleUrls: ['./plan-project-details.component.scss']
})
export class PlanProjectDetailsComponent {

  @Input() public readonly dataSource: model.PlanProject[];
  @Input() public readonly displayedColumns: string[];
}
