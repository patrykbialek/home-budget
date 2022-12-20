
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import * as fromContainers from '../plans/containers';

import { PlansComponent } from './plans.component';

const routes: Routes = [
  { path: '', redirectTo: 'project', pathMatch: 'full' },
  {
    path: '',
    component: PlansComponent,
    data: { title: 'Plan | home_budget' },
    children: [
      {
        path: 'project',
        component: fromContainers.PlanComponent,
      },
      {
        path: 'execution',
        component: fromContainers.PlanComponent,
      },
      {
        path: 'project/details',
        component: fromContainers.PlanDetailsComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanRoutingModule { }
