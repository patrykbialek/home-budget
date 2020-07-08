import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationComponent } from './authentication.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { AuthenticationRoutingModule } from './authentication-routing.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers, effects } from './store';

import * as fromContainers from './containers';
import * as fromComponents from './components';
import { ReactiveFormsModule } from '@angular/forms';

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

    StoreModule.forFeature('authentication', reducers),
    EffectsModule.forFeature(effects),
  ],
  exports: [
    ...fromContainers.components,
    ...fromComponents.components,
  ]
})
export class AuthenticationModule { }
