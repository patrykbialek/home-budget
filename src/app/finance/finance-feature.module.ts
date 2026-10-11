import { BaseChartDirective } from 'ng2-charts';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { AuthenticationStoreModule } from '@authentication/store/authentication-store.module';
import { SharedModule } from '@shared/shared.module';

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
 */
@NgModule({
  declarations: [
    FinanceComponent,
    ...fromComponents.components,
    ...fromContainers.components,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,

    SharedModule,
    AuthenticationStoreModule,

    BaseChartDirective,
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
