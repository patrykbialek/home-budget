import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FinanceComponent } from '@home-budget/finance/finance.component';
import { FinanceDetailsComponent, FinanceSummaryComponent } from '@home-budget/finance/containers';

const routes: Routes = [
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetsRoutingModule { }
