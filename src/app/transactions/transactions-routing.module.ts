
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import * as fromContainers from '@home-budget/transactions/containers';
import { TransactionsComponent } from '@home-budget/transactions/transactions.component';

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
