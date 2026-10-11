import { Component, inject } from '@angular/core';

import * as config from './shared/budget.config';
import * as fromModels from '@home-budget/budget/models';
import { BUDGET_FEATURE_CONFIG } from './budget-feature.config';

@Component({
  selector: 'hb-budget-shell',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss'],
  standalone: false
})
export class BudgetComponent {
  navLinks: fromModels.NavLink[] = config.navLinks;
  readonly i18nPrefix = inject(BUDGET_FEATURE_CONFIG).i18nPrefix;
}
