import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from '@home-budget/authentication/authentication.component';
import * as fromContainers from '@home-budget/authentication/containers';

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
      {
        path: 'login',
        component: fromContainers.LoginUserComponent,
      },
      {
        path: 'reset-password',
        component: fromContainers.ResetPasswordComponent,
      },
      {
        path: 'set-password',
        component: fromContainers.SetPasswordComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
