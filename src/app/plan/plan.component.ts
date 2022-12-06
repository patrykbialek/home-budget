import { Component } from '@angular/core';
import { SharedUtilsService } from '@shared/services/shared-utils.service';

import * as config from './plan.config';
import * as model from './plan.model';

@Component({
  selector: 'hb-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent {

  public windowSize$ = this.sharedUtilsService.windowSize$;
  public navLinks: model.NavLink[] = config.navLinks;

  constructor(
    private sharedUtilsService: SharedUtilsService,
  ) { }

}
