import { NgModule } from '@angular/core';

import { BUDGET_FEATURE_CONFIG } from '@home-budget/budget/budget-feature.config';
import { BudgetFeatureModule } from '@home-budget/budget/budget-feature.module';

import { PlansRoutingModule } from './plans-routing.module';

@NgModule({
  imports: [
    BudgetFeatureModule,
    PlansRoutingModule,
  ],
  providers: [
    { provide: BUDGET_FEATURE_CONFIG, useValue: { collection: 'plans', i18nPrefix: 'PLAN' } },
  ],
})
export class PlansModule { }
