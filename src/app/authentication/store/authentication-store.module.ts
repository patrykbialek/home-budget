import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { effects, reducers } from '@home-budget/authentication/store';

@NgModule({
  imports: [
    StoreModule.forFeature('authentication', reducers),
    EffectsModule.forFeature(effects),
  ],
})
export class AuthenticationStoreModule { }
