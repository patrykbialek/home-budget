import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import * as fromContainers from '../plans/containers';

import { BudgetsComponent } from './budgets.component';

const routes: Routes = [
  { path: '', redirectTo: 'project', pathMatch: 'full' },
  {
    path: '',
    component: BudgetsComponent,
    data: { title: 'Budzet | home_budget' },
    children: [
      {
        path: 'project',
        component: fromContainers.PlanSummaryComponent,
      },
      {
        path: 'execution',
        component: fromContainers.PlanSummaryComponent,
      },
      {
        path: 'project/details',
        component: fromContainers.PlanDetailsComponent,
      },
      {
        path: 'execution/details',
        component: fromContainers.PlanDetailsComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetsRoutingModule { }
