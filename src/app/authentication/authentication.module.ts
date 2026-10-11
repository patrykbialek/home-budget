import { NgModule } from '@angular/core';
import { AuthenticationRoutingModule } from '@home-budget/authentication/authentication-routing.module';
import { AuthenticationComponent } from '@home-budget/authentication/authentication.component';
import * as fromComponents from '@home-budget/authentication/components';
import * as fromContainers from '@home-budget/authentication/containers';
import { AuthenticationStoreModule } from '@home-budget/authentication/store/authentication-store.module';

@NgModule({
  imports: [
    AuthenticationRoutingModule,
    AuthenticationStoreModule,
    AuthenticationComponent,
    ...fromContainers.components,
    ...fromComponents.components,
  ],
  exports: [
    ...fromContainers.components,
    ...fromComponents.components,
  ]
})
export class AuthenticationModule { }
