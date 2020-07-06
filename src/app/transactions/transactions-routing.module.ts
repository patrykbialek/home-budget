
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransactionsComponent } from './transactions.component';
import * as fromContainers from './containers';

const routes: Routes = [
  {
    path: '',
    component: TransactionsComponent,
    data: { title: 'Transactions | home_budget' },
    children: [
      {
        path: '',
        component: fromContainers.TransactionListComponent,
      },
      {
        path: ':key',
        component: fromContainers.TransactionDetailComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsRoutingModule { }
