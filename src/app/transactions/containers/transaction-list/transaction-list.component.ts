import { Component, OnInit } from '@angular/core';
import { CommonWithAnimationComponent } from '@shared/components';

import * as fromStore from '../../store';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'hb-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent extends CommonWithAnimationComponent implements OnInit {

  total$ = this.transactionsService.total$;
  transactions$ = this.transactionsService.transactions$;

  initQuery = {};

  constructor(
    private transactionsService: fromStore.TransactionsFacadeService
  ) {
    super();
  }

  ngOnInit() {
    this.transactionsService.readTransactions(this.initQuery);
  }

  readTransactions(query: any) {
    this.transactionsService.readTransactions(query);
  }

}
