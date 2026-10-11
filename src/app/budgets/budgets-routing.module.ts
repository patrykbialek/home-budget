import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BudgetComponent } from '@home-budget/budget/budget.component';
import { BudgetDetailsComponent, BudgetSummaryComponent } from '@home-budget/budget/containers';

const routes: Routes = [
  { path: '', redirectTo: 'execution', pathMatch: 'full' },
  {
    path: '',
    component: BudgetComponent,
    data: { title: 'Budżet | home_budget' },
    children: [
      { path: 'project', component: BudgetSummaryComponent },
      { path: 'execution', component: BudgetSummaryComponent },
      { path: 'project/details', component: BudgetDetailsComponent },
      { path: 'execution/details', component: BudgetDetailsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetsRoutingModule { }
