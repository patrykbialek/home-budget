import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BreadcrumbsItem } from '../../../plans/containers/plan-breadcrumbs/plan-breadcrumbs.model';

@Component({
  selector: 'hb-plan-breadcrumbs-list',
  templateUrl: './plan-breadcrumbs-list.component.html',
  styleUrls: ['./plan-breadcrumbs-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanBreadcrumbsListComponent {
  @Input() public readonly breadcrumbs: BreadcrumbsItem[];
  @Output() public readonly goToDetails: EventEmitter<BreadcrumbsItem> = new EventEmitter();

  public onGoToDetails(event: BreadcrumbsItem): void {
    this.goToDetails.emit(event);
  }
}
