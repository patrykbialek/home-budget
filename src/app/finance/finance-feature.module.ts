import { NgModule } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';

import { FinanceComponent } from './finance.component';
import * as fromComponents from './components';
import * as fromContainers from './containers';
import { FinanceBreadcrumbsService } from './services/finance-breadcrumbs.service';
import { FinanceFacadeService } from './services/finance-facade.service';
import { FinanceFormService } from './services/finance-form.service';
import { FinanceService } from './services/finance.service';

/**
 * Shared implementation for the structurally identical `plans` and `finances`
 * features. Thin feature modules (PlansModule / FinancesModule) import this and
 * provide a {@link FINANCE_FEATURE_CONFIG} that selects the Firebase collection and
 * i18n namespace. The stateful services are provided here (not in root) so each
 * lazy-loaded host module gets its own isolated instance and state.
 *
 * Components are standalone and import their own dependencies, so this module no
 * longer needs CommonModule/RouterModule/ReactiveFormsModule/SharedModule/etc.
 */
@NgModule({
  imports: [
    FinanceComponent,
    ...fromComponents.components,
    ...fromContainers.components,
  ],
  exports: [
    FinanceComponent,
    ...fromComponents.components,
    ...fromContainers.components,
  ],
  providers: [
    FinanceService,
    FinanceFacadeService,
    FinanceBreadcrumbsService,
    FinanceFormService,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  ],
})
export class FinanceFeatureModule { }
