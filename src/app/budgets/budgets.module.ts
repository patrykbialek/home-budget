import { NgModule } from '@angular/core';

import { BUDGET_FEATURE_CONFIG } from '@home-budget/budget/budget-feature.config';
import { BudgetFeatureModule } from '@home-budget/budget/budget-feature.module';

import { BudgetsRoutingModule } from './budgets-routing.module';

@NgModule({
  imports: [
    BudgetFeatureModule,
    BudgetsRoutingModule,
  ],
  providers: [
    { provide: BUDGET_FEATURE_CONFIG, useValue: { collection: 'budgets', i18nPrefix: 'BUDGET' } },
  ],
})
export class BudgetsModule { }
