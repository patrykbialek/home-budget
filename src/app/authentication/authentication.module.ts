import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationComponent } from './authentication.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { AuthenticationRoutingModule } from './authentication-routing.module';

import * as fromContainers from './containers';
import * as fromComponents from './components';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthenticationStoreModule } from './store/authentication-store.module';

@NgModule({
  declarations: [
    AuthenticationComponent,
    ...fromContainers.components,
    ...fromComponents.components,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule,
    AuthenticationRoutingModule,

    AuthenticationStoreModule,
  ],
  exports: [
    ...fromContainers.components,
    ...fromComponents.components,
  ]
})
export class AuthenticationModule { }
