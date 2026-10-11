import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from '@home-budget/authentication/authentication.component';
import { LoginUserComponent, RegisterUserComponent, ResetPasswordComponent, SetPasswordComponent } from '@home-budget/authentication/containers';

const routes: Routes = [
  {
    path: '',
    component: AuthenticationComponent,
    data: { title: 'Authentication | home_budget' },
    children: [
      {
        path: 'register',
        component: RegisterUserComponent,
      },
      {
        path: 'login',
        component: LoginUserComponent,
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
      },
      {
        path: 'set-password',
        component: SetPasswordComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
