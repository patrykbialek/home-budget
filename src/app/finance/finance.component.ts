import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLinkActive, RouterLink, RouterOutlet } from '@angular/router';

import { TranslatePipe } from '@ngx-translate/core';
import { map } from 'rxjs/operators';

import { CommonWithAnimationComponent } from '../shared/components/common-with-animation.component';
import { CoreService } from '@home-budget/core/core.service';
import { FINANCE_FEATURE_CONFIG } from './finance-feature.config';
import { FinanceBreadcrumbsComponent } from './containers/finance-breadcrumbs/finance-breadcrumbs.component';
import { NavLink } from '@home-budget/finance/models';
import { navLinks } from './shared/finance.config';

@Component({
  selector: 'hb-finance-shell',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss'],
  imports: [
    AsyncPipe,
    CommonWithAnimationComponent,
    MatButton, RouterLinkActive,
    RouterLink, FinanceBreadcrumbsComponent,
    RouterOutlet, TranslatePipe
  ]
})
export class FinanceComponent {
  readonly i18nPrefix = inject(FINANCE_FEATURE_CONFIG).i18nPrefix;

  private readonly coreService = inject(CoreService);

  navLinks$ = this.coreService.year$.pipe(
    map((year: string) => navLinks.filter(
      (link: NavLink) => !link.minYear || Number(year) >= link.minYear,
    )),
  );
}
