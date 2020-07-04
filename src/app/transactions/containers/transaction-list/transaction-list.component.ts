import { Component, OnInit } from '@angular/core';
import { CommonWithAnimationComponent } from '@shared/components';

@Component({
  selector: 'hb-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent extends CommonWithAnimationComponent {
  constructor(
  ) {
    super();
  }

}
