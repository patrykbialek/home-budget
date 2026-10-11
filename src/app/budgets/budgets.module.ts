import { NgModule } from '@angular/core';

import { FINANCE_FEATURE_CONFIG } from '@home-budget/finance/finance-feature.config';
import { FinanceFeatureModule } from '@home-budget/finance/finance-feature.module';

import { BudgetsRoutingModule } from './budgets-routing.module';

@NgModule({
  imports: [
    FinanceFeatureModule,
    BudgetsRoutingModule,
  ],
  providers: [
    { provide: FINANCE_FEATURE_CONFIG, useValue: { collection: 'budgets', i18nPrefix: 'BUDGET' } },
  ],
})
export class BudgetsModule { }
