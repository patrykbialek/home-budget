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
}
