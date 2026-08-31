import { Component } from '@angular/core';

import * as config from './shared/budgets.config';
import * as fromModels from '@budgets/models';

@Component({
  selector: 'hb-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.scss'],
  standalone: false
})
export class BudgetsComponent {
  navLinks: fromModels.NavLink[] = config.navLinks;
}
