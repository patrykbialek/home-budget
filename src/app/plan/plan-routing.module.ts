
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import * as fromContainers from '@home-budget/plan/containers';

import { PlanComponent } from './plan.component';

const routes: Routes = [
  { path: '', redirectTo: 'project', pathMatch: 'full' },
  {
    path: '',
    component: PlanComponent,
    data: { title: 'Plan | home_budget' },
    children: [
      {
        path: 'project',
        component: fromContainers.PlanProjectComponent,
      },
      {
        path: 'execution',
        component: fromContainers.PlanProjectComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanRoutingModule { }
