import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import * as fromContainers from '../budgets/containers';

import { BudgetsComponent } from './budgets.component';

const routes: Routes = [
  { path: '', redirectTo: 'execution', pathMatch: 'full' },
  {
    path: '',
    component: BudgetsComponent,
    data: { title: 'Budzet | home_budget' },
    children: [
      {
        path: 'project',
        component: fromContainers.BudgetSummaryComponent,
      },
      {
        path: 'execution',
        component: fromContainers.BudgetSummaryComponent,
      },
      {
        path: 'project/details',
        component: fromContainers.BudgetDetailsComponent,
      },
      {
        path: 'execution/details',
        component: fromContainers.BudgetDetailsComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetsRoutingModule { }
