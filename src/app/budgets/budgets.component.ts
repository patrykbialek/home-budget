import { Component } from '@angular/core';

import * as config from './shared/budgets.config';
import * as fromModels from '@budgets/models';

@Component({
  selector: 'hb-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.scss'],
})
export class BudgetsComponent {
  public navLinks: fromModels.NavLink[] = config.navLinks;
}
