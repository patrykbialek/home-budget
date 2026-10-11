import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthenticationRoutingModule } from '@home-budget/authentication/authentication-routing.module';
import { AuthenticationComponent } from '@home-budget/authentication/authentication.component';
import * as fromComponents from '@home-budget/authentication/components';
import * as fromContainers from '@home-budget/authentication/containers';
import { AuthenticationStoreModule } from '@home-budget/authentication/store/authentication-store.module';
import { SharedModule } from '@home-budget/shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        SharedModule,
        AuthenticationRoutingModule,
        AuthenticationStoreModule,
        AuthenticationComponent,
        ...fromContainers.components,
        ...fromComponents.components,
    ],
    exports: [
        ...fromContainers.components,
        ...fromComponents.components,
    ]
})
export class AuthenticationModule { }
