import { Component } from '@angular/core';
import { CommonWithAnimationComponent } from '@home-budget/shared/components/common-with-animation.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent extends CommonWithAnimationComponent {
  constructor(
  ) {
    super();
  }

}
