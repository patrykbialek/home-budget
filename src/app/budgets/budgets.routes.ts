import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Routes } from '@angular/router';

import { FINANCE_FEATURE_CONFIG } from '@home-budget/finance/finance-feature.config';
import { FinanceBreadcrumbsService } from '@home-budget/finance/services/finance-breadcrumbs.service';
import { FinanceComponent } from '@home-budget/finance/finance.component';
import { FinanceDetailsComponent, FinanceSummaryComponent } from '@home-budget/finance/containers';
import { FinanceFacadeService } from '@home-budget/finance/services/finance-facade.service';
import { FinanceFormService } from '@home-budget/finance/services/finance-form.service';
import { FinanceService } from '@home-budget/finance/services/finance.service';
import { FinanceWriteService } from '@home-budget/finance/services/finance-write.service';

export const BUDGETS_ROUTES: Routes = [
  {
    path: '',
    providers: [
      { provide: FINANCE_FEATURE_CONFIG, useValue: { collection: 'budgets', i18nPrefix: 'BUDGET' } },
      FinanceService,
      FinanceWriteService,
      FinanceFacadeService,
      FinanceBreadcrumbsService,
      FinanceFormService,
      { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    ],
    children: [
      { path: '', redirectTo: 'execution', pathMatch: 'full' },
      {
        path: '',
        component: FinanceComponent,
        data: { title: 'Budżet | home_budget' },
        children: [
          { path: 'project', component: FinanceSummaryComponent },
          { path: 'execution', component: FinanceSummaryComponent },
          { path: 'project/details', component: FinanceDetailsComponent },
          { path: 'execution/details', component: FinanceDetailsComponent },
        ],
      },
    ],
  },
];
