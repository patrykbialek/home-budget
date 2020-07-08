import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsComponent } from './transactions.component';
import { RouterModule } from '@angular/router';

import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

import { SharedModule } from '@shared/shared.module';
import { TransactionsRoutingModule } from '@transactions/transactions-routing.module';

import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
registerLocaleData(localePl, 'pl');

import * as fromComponents from './components';
import * as fromContainers from './containers';
import { ReactiveFormsModule } from '@angular/forms';
import { TransactionsStoreModule } from './store/transactions-store.module';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};

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
    TransactionsStoreModule,
  ],
  exports: [
    ...fromComponents.components,
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class TransactionsModule { }
