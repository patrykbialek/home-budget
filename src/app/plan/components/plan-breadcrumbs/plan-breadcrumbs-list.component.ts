import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'hb-plan-breadcrumbs-list',
  templateUrl: './plan-breadcrumbs-list.component.html',
  styleUrls: ['./plan-breadcrumbs-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanBreadcrumbsListComponent {
  @Input() public readonly breadcrumbs: any[];
  @Output() public readonly goToDetails: EventEmitter<any> = new EventEmitter();

  public onGoToDetails(event: any): void {
    this.goToDetails.emit(event);
  }
}
