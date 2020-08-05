
import { Component, Input, } from '@angular/core';

@Component({
  selector: 'bh-category-icon',
  templateUrl: 'budget-category-icon.component.html',
})
export class BudgetCategoryIconComponent {

  @Input() category: string;
}
