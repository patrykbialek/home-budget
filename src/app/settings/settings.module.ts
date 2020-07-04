import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { SettingsRoutingModule } from './settings-routing.module';


@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    RouterModule,

    SharedModule,
    SettingsRoutingModule,

  ]
})
export class SettingsModule { }
