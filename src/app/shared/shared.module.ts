import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularMaterialModule } from './modules/angular-material.module';
import {TranslateModule} from '@ngx-translate/core';

import * as fromComponents from './components';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ...fromComponents.components,
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule,

    TranslateModule,
  ],
  exports: [
    AngularMaterialModule,
    TranslateModule,
    ...fromComponents.components,
  ]
})
export class SharedModule { }
