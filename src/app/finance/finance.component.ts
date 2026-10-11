import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLinkActive, RouterLink, RouterOutlet } from '@angular/router';

import { TranslatePipe } from '@ngx-translate/core';

import { CommonWithAnimationComponent } from '../shared/components/common-with-animation.component';
import { FINANCE_FEATURE_CONFIG } from './finance-feature.config';
import { FinanceBreadcrumbsComponent } from './containers/finance-breadcrumbs/finance-breadcrumbs.component';
import { NavLink } from '@home-budget/finance/models';
import { navLinks } from './shared/finance.config';

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
  navLinks: NavLink[] = navLinks;
  readonly i18nPrefix = inject(FINANCE_FEATURE_CONFIG).i18nPrefix;
}
