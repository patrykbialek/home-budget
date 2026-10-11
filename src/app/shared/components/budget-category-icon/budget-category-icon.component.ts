import { Component, input } from '@angular/core';

@Component({
  selector: 'hb-category-icon',
  templateUrl: 'budget-category-icon.component.html',
  standalone: false
})
export class BudgetCategoryIconComponent {
  category = input.required<string>();
}
