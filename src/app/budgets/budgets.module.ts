import { ChartsModule } from 'ng2-charts';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { AuthenticationStoreModule } from '@authentication/store/authentication-store.module';
import { SharedModule } from '@shared/shared.module';

import { BudgetsRoutingModule } from './budgets-routing.module';
import { BudgetsComponent } from './budgets.component';
import * as fromComponents from './components';
import * as fromContainers from './containers';

@NgModule({
  declarations: [
    BudgetsComponent,
    ...fromComponents.components,
    ...fromContainers.components,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,

    SharedModule,
    BudgetsRoutingModule,
    AuthenticationStoreModule,

    ChartsModule,
  ],
  exports: [
    ...fromComponents.components,
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  ],
})
export class BudgetsModule { }
