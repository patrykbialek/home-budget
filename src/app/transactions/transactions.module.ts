import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsComponent } from './transactions.component';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { TransactionsRoutingModule } from '@transactions/transactions-routing.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers, effects } from './store';

import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
registerLocaleData(localePl, 'pl');

import * as fromComponents from './components';
import * as fromContainers from './containers';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TransactionsComponent,
    ...fromContainers.components,
    ...fromComponents.components,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,

    SharedModule,
    TransactionsRoutingModule,

    StoreModule.forFeature('transactions', reducers),
    EffectsModule.forFeature(effects),
  ],
  exports: [
    ...fromComponents.components,
  ]
})
export class TransactionsModule { }
