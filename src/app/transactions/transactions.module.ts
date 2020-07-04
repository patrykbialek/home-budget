import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsComponent } from './transactions.component';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { TransactionsRoutingModule } from './transactions-routing.module';

@NgModule({
  declarations: [TransactionsComponent],
  imports: [
    CommonModule,
    RouterModule,

    SharedModule,
    TransactionsRoutingModule,
  ]
})
export class TransactionsModule { }
