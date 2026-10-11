import { Routes } from '@angular/router';

import { AuthenticationComponent } from '@home-budget/authentication/authentication.component';
import { LoginUserComponent, RegisterUserComponent, ResetPasswordComponent, SetPasswordComponent } from '@home-budget/authentication/containers';

export const AUTHENTICATION_ROUTES: Routes = [
  {
    path: '',
    component: AuthenticationComponent,
    data: { title: 'Authentication | home_budget' },
    children: [
      { path: 'register', component: RegisterUserComponent },
      { path: 'login', component: LoginUserComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'set-password', component: SetPasswordComponent },
    ],
  },
];
