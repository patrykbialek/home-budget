import { Component, inject } from '@angular/core';

import * as config from './shared/finance.config';
import * as fromModels from '@home-budget/finance/models';
import { FINANCE_FEATURE_CONFIG } from './finance-feature.config';
import { CommonWithAnimationComponent } from '../shared/components/common-with-animation.component';
import { MatButton } from '@angular/material/button';
import { RouterLinkActive, RouterLink, RouterOutlet } from '@angular/router';
import { FinanceBreadcrumbsComponent } from './containers/finance-breadcrumbs/finance-breadcrumbs.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'hb-finance-shell',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss'],
  imports: [
    CommonWithAnimationComponent,
    MatButton, RouterLinkActive,
    RouterLink, FinanceBreadcrumbsComponent,
    RouterOutlet, TranslatePipe
  ]
})
export class FinanceComponent {
  navLinks: fromModels.NavLink[] = config.navLinks;
  readonly i18nPrefix = inject(FINANCE_FEATURE_CONFIG).i18nPrefix;
}
