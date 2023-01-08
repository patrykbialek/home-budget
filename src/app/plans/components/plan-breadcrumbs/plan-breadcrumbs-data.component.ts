import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BreadcrumbsItem } from '@home-budget/plans/models/plan-breadcrumbs.model';

@Component({
  selector: 'hb-plan-breadcrumbs-data',
  templateUrl: './plan-breadcrumbs-data.component.html',
  styleUrls: ['./plan-breadcrumbs-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanBreadcrumbsDataComponent {
  @Input() public readonly breadcrumbs: BreadcrumbsItem[];
  @Input() public readonly isAddColumnButtonShown: boolean;

  @Output() public readonly addColumn: EventEmitter<void> = new EventEmitter();
  @Output() public readonly goToDetails: EventEmitter<BreadcrumbsItem> = new EventEmitter();

  public onAddColumn(): void {
    this.addColumn.emit();
  }

  public onGoToDetails(event: BreadcrumbsItem): void {
    this.goToDetails.emit(event);
  }

}
