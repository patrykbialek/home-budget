import { Component } from '@angular/core';

import { planProjectEntities } from '../../plan-project.data';
import * as config from '../../plan.config';
import * as model from '../../plan.model';

@Component({
  selector: 'hb-plan-project',
  templateUrl: './plan-project.component.html',
  styleUrls: ['./plan-project.component.scss']
})
export class PlanProjectComponent {

  public displayedColumns: string[] = config.planProjectDetailsColumns;
  public dataSource: model.PlanProject[] = planProjectEntities;
}
