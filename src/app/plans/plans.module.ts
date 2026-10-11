import { NgModule } from '@angular/core';

import { FINANCE_FEATURE_CONFIG } from '@home-budget/finance/finance-feature.config';
import { FinanceFeatureModule } from '@home-budget/finance/finance-feature.module';

import { PlansRoutingModule } from './plans-routing.module';

@NgModule({
  imports: [
    FinanceFeatureModule,
    PlansRoutingModule,
  ],
  providers: [
    { provide: FINANCE_FEATURE_CONFIG, useValue: { collection: 'plans', i18nPrefix: 'PLAN' } },
  ],
})
export class PlansModule { }
