import { BaseChartDirective } from 'ng2-charts';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { AuthenticationStoreModule } from '@authentication/store/authentication-store.module';
import { SharedModule } from '@shared/shared.module';

import { BudgetComponent } from './budget.component';
import * as fromComponents from './components';
import * as fromContainers from './containers';
import { BudgetBreadcrumbsService } from './services/budget-breadcrumbs.service';
import { BudgetFacadeService } from './services/budget-facade.service';
import { BudgetFormService } from './services/budget-form.service';
import { BudgetService } from './services/budget.service';

/**
 * Shared implementation for the structurally identical `plans` and `budgets`
 * features. Thin feature modules (PlansModule / BudgetsModule) import this and
 * provide a {@link BUDGET_FEATURE_CONFIG} that selects the Firebase collection and
 * i18n namespace. The stateful services are provided here (not in root) so each
 * lazy-loaded host module gets its own isolated instance and state.
 */
@NgModule({
  declarations: [
    BudgetComponent,
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
    BudgetComponent,
    ...fromComponents.components,
    ...fromContainers.components,
  ],
  providers: [
    BudgetService,
    BudgetFacadeService,
    BudgetBreadcrumbsService,
    BudgetFormService,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  ],
})
export class BudgetFeatureModule { }
