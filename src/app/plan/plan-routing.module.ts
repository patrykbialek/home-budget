
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlanComponent } from './plan.component';

// import * as fromContainers from '@home-budget/plan/containers';

const routes: Routes = [
  {
    path: '',
    component: PlanComponent,
    data: { title: 'Plan | home_budget' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanRoutingModule { }
