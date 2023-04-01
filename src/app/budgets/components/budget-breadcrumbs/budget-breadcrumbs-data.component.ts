import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BreadcrumbsItem } from '@budgets/models/plan-breadcrumbs.model';

@Component({
  selector: 'hb-budget-breadcrumbs-data',
  templateUrl: './budget-breadcrumbs-data.component.html',
  styleUrls: ['./budget-breadcrumbs-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetBreadcrumbsDataComponent {
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
