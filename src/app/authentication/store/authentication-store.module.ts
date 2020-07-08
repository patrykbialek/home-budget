import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers, effects } from '../store';

@NgModule({
  imports: [
    StoreModule.forFeature('authentication', reducers),
    EffectsModule.forFeature(effects),
  ],
})
export class AuthenticationStoreModule { }
