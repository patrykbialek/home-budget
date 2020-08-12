import { Component } from '@angular/core';
import { CommonWithAnimationComponent } from '@home-budget/shared/components/common-with-animation.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent extends CommonWithAnimationComponent {
  constructor(
  ) {
    super();
  }

}
