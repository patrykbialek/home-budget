import { Observable } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { SharedUtilsService } from '@shared/services/shared-utils.service';

import * as config from './plan.config';
import * as model from './plan.model';
import { PlanService } from './plan.service';

@Component({
  selector: 'hb-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit {

  public navLinks: model.NavLink[] = config.navLinks;
  public windowSize$ = this.sharedUtilsService.windowSize$;
  public breadcrumbsState$: Observable<string[]> = this.planService.breadcrumbsState$;

  constructor(
    private readonly planService: PlanService,
    private readonly sharedUtilsService: SharedUtilsService,
  ) { }

  public ngOnInit(): void {
  }
}
