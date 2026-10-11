import { NgModule } from '@angular/core';
import { AuthenticationStoreModule } from '@home-budget/authentication/store/authentication-store.module';
import * as fromComponents from '@home-budget/shared/components';
import { AngularMaterialModule } from '@home-budget/shared/modules/angular-material.module';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';

@NgModule({
  imports: [
    AngularMaterialModule,
    TranslateDirective,
    TranslatePipe,
    AuthenticationStoreModule,
    ...fromComponents.components,
  ],
  exports: [
    AngularMaterialModule,
    TranslateDirective,
    TranslatePipe,
    ...fromComponents.components,
  ],
})
export class SharedModule { }
