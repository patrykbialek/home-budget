import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthenticationStoreModule } from '@home-budget/authentication/store/authentication-store.module';
import * as fromComponents from '@home-budget/shared/components';
import { AngularMaterialModule } from '@home-budget/shared/modules/angular-material.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ...fromComponents.components,
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule,

    TranslateModule.forChild(),
    AuthenticationStoreModule,
  ],
  exports: [
    AngularMaterialModule,
    TranslateModule,
    ...fromComponents.components,
  ],
})
export class SharedModule { }
