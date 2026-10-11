import { Component, input } from '@angular/core';
import { NgSwitch, NgSwitchCase } from '@angular/common';

@Component({
  selector: 'hb-category-icon',
  templateUrl: 'budget-category-icon.component.html',
  imports: [NgSwitch, NgSwitchCase]
})
export class BudgetCategoryIconComponent {
  category = input.required<string>();
}
