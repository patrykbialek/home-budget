import { Component, OnInit } from '@angular/core';
import { CommonWithAnimationComponent } from '@shared/components';

import * as fromStore from '../../store';

@Component({
  selector: 'hb-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent extends CommonWithAnimationComponent implements OnInit {

  transactions$ = this.transactionsService.transactions$;

  constructor(
    private transactionsService: fromStore.TransactionsFacadeService
  ) {
    super();
  }

  ngOnInit() {
    this.transactionsService.readTransactions();
  }

}
