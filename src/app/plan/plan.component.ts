import { Component, OnInit } from '@angular/core';
import { SharedUtilsService } from '@shared/services/shared-utils.service';

@Component({
  selector: 'hb-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit {

  windowSize$ = this.sharedUtilsService.windowSize$;

  constructor(
    private sharedUtilsService: SharedUtilsService,
  ) { }

  ngOnInit(): void {
  }

}
