import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularMaterialModule } from './modules/angular-material.module';
import {TranslateModule} from '@ngx-translate/core';

import * as fromComponents from './components';
import { RouterModule } from '@angular/router';
import { AuthenticationStoreModule } from '@authentication/store/authentication-store.module';

@NgModule({
  declarations: [
    ...fromComponents.components,
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule,

    TranslateModule,
    AuthenticationStoreModule,
  ],
  exports: [
    AngularMaterialModule,
    TranslateModule,
    ...fromComponents.components,
  ]
})
export class SharedModule { }
