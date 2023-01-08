import { Component } from '@angular/core';

import * as config from './shared/plans.config';
import * as fromModels from '@home-budget/plans/models';

@Component({
  selector: 'hb-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss'],
})
export class PlansComponent {
  public navLinks: fromModels.NavLink[] = config.navLinks;

  // public initiatePlan(): void {
  //   const year: string = '2023';
  //   this.plansHttpService.initiatePlan(year);
  // }

  // public create(): void {
  //   const uid: string = Math.random().toString(16).slice(2);
  //   const payload = {
  //     uid,
  //     label: 'Projekt',
  //     entries: {},
  //     path: `/2023/${uid}`,
  //   };
  //   this.plansHttpService.createPlan(payload);
  // }
}
