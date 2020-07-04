import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsComponent } from './transactions.component';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { TransactionsRoutingModule } from '@transactions/transactions-routing.module';

import * as fromComponents from './components';
import * as fromContainers from './containers';

@NgModule({
  declarations: [
    TransactionsComponent,
    ...fromContainers.components,
    ...fromComponents.components,
  ],
  imports: [
    CommonModule,
    RouterModule,

    SharedModule,
    TransactionsRoutingModule,
  ],
  exports: [
    ...fromComponents.components,
  ]
})
export class TransactionsModule { }
