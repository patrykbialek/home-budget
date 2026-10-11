import { NgModule } from '@angular/core';
import { AuthenticationRoutingModule } from '@home-budget/authentication/authentication-routing.module';
import { AuthenticationComponent } from '@home-budget/authentication/authentication.component';
import { components as authComponents } from '@home-budget/authentication/components';
import { components as authContainers } from '@home-budget/authentication/containers';
import { AuthenticationStoreModule } from '@home-budget/authentication/store/authentication-store.module';

@NgModule({
  imports: [
    AuthenticationRoutingModule,
    AuthenticationStoreModule,
    AuthenticationComponent,
    ...authContainers,
    ...authComponents,
  ],
  exports: [
    ...authContainers,
    ...authComponents,
  ]
})
export class AuthenticationModule { }
