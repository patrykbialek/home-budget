import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SettingsRoutingModule } from '@home-budget/settings/settings-routing.module';
import { SettingsComponent } from '@home-budget/settings/settings.component';
import { SharedModule } from '@home-budget/shared/shared.module';

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
