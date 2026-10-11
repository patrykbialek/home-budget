import { NgModule } from '@angular/core';

import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';

import { AngularMaterialModule } from '@home-budget/shared/modules/angular-material.module';
import { AuthenticationStoreModule } from '@home-budget/authentication/store/authentication-store.module';
import { components } from '@home-budget/shared/components';

@NgModule({
  imports: [
    AngularMaterialModule,
    TranslateDirective,
    TranslatePipe,
    AuthenticationStoreModule,
    ...components,
  ],
  exports: [
    AngularMaterialModule,
    TranslateDirective,
    TranslatePipe,
    ...components,
  ],
})
export class SharedModule { }
