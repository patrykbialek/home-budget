import { Routes } from '@angular/router';

import { AuthGuardService } from '@home-budget/shared/services/auth-guard.service';
import { PageNotFoundComponent } from '@home-budget/shared/components';
import { YearGuard } from '@home-budget/shared/services/year-guard.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    loadChildren: () => import('./authentication/authentication.routes').then(m => m.AUTHENTICATION_ROUTES),
  },
  {
    path: ':year',
    canActivate: [AuthGuardService, YearGuard],
    children: [
      {
        path: 'plans',
        loadChildren: () => import('./plans/plans.routes').then(m => m.PLANS_ROUTES),
      },
      {
        path: 'budgets',
        loadChildren: () => import('./budgets/budgets.routes').then(m => m.BUDGETS_ROUTES),
      },
      { path: '', redirectTo: 'plans', pathMatch: 'full' },
    ],
  },
  { path: '**', component: PageNotFoundComponent },
];
