import { Component, inject } from '@angular/core';

import * as config from './shared/finance.config';
import * as fromModels from '@home-budget/finance/models';
import { FINANCE_FEATURE_CONFIG } from './finance-feature.config';

@Component({
  selector: 'hb-finance-shell',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss'],
  standalone: false
})
export class FinanceComponent {
  navLinks: fromModels.NavLink[] = config.navLinks;
  readonly i18nPrefix = inject(FINANCE_FEATURE_CONFIG).i18nPrefix;
}
