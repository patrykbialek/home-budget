import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularMaterialModule } from './modules/angular-material.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,

    AngularMaterialModule,

    TranslateModule,
  ],
  exports: [
    AngularMaterialModule,
    TranslateModule,
  ]
})
export class SharedModule { }
