import { NgModule } from '@angular/core';
import { effects, reducers } from '@home-budget/authentication/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

@NgModule({
  imports: [
    StoreModule.forFeature('authentication', reducers),
    EffectsModule.forFeature(effects),
  ],
})
export class AuthenticationStoreModule { }
