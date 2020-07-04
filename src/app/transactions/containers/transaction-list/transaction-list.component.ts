import { Component, OnInit } from '@angular/core';
import { CommonWithAnimationComponent } from '@shared/components';

import * as fromServices from '../../services';

@Component({
  selector: 'hb-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent extends CommonWithAnimationComponent implements OnInit {
  constructor(
    private transactionsService: fromServices.TransactionsHttpService,
  ) {
    super();
  }

  ngOnInit() {
    this.transactionsService.readTransactions().subscribe(console.log);
  }

}
