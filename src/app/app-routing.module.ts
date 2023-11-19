import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from '@home-budget/shared/components';
import { AuthGuardService } from '@home-budget/shared/services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule)
  },
  {
    path: 'plans',
    loadChildren: () => import('./plans/plans.module').then(m => m.PlansModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'budgets',
    loadChildren: () => import('./budgets/budgets.module').then(m => m.BudgetsModule),
    canActivate: [AuthGuardService],
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
