import { Component } from '@angular/core';

import * as config from './shared/plans.config';
import * as fromModels from '@home-budget/plans/models';

@Component({
  selector: 'hb-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss'],
  standalone: false
})
export class PlansComponent {
  navLinks: fromModels.NavLink[] = config.navLinks;
}
