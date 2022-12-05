import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { AuthenticationStoreModule } from '@authentication/store/authentication-store.module';
import { SharedModule } from '@shared/shared.module';
import { MY_FORMATS } from '@transactions/transactions.module';

import { PlanRoutingModule } from './plan-routing.module';
import { PlanComponent } from './plan.component';

@NgModule({
  declarations: [
    PlanComponent,
    // ...fromContainers.components,
    // ...fromComponents.components,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,

    SharedModule,
    PlanRoutingModule,
    // TransactionsStoreModule,
    AuthenticationStoreModule,
  ],
  exports: [
    // ...fromComponents.components,
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PlanModule { }