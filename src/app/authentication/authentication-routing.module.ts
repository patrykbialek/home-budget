import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationComponent } from '@authentication/authentication.component';
import * as fromContainers from './containers';

const routes: Routes = [
  {
    path: '',
    component: AuthenticationComponent,
    data: { title: 'Authentication | home_budget' },
    children: [
      {
        path: 'register',
        component: fromContainers.RegisterUserComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
