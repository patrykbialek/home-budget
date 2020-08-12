import { CommonModule, registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { AuthenticationStoreModule } from '@home-budget/authentication/store/authentication-store.module';
import { SharedModule } from '@home-budget/shared/shared.module';
import * as fromComponents from '@home-budget/transactions/components';
import * as fromContainers from '@home-budget/transactions/containers';
import { TransactionsStoreModule } from '@home-budget/transactions/store/transactions-store.module';
import { TransactionsRoutingModule } from '@home-budget/transactions/transactions-routing.module';
import { TransactionsComponent } from '@home-budget/transactions/transactions.component';

registerLocaleData(localePl, 'pl');

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
    AuthenticationStoreModule,
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
