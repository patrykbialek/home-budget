import { Component, OnInit } from '@angular/core';
import { CommonWithAnimationComponent } from '@shared/components';

import * as fromStore from '../../store';
import { AuthenticationHttpService } from '@authentication/services';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'hb-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent extends CommonWithAnimationComponent implements OnInit {

  uid: string;

  total$ = this.transactionsService.total$;
  transactions$ = this.transactionsService.transactions$;
  user$ = this.authenticationService.authState$;

  initQuery = {};

  constructor(
    private authenticationService: AuthenticationHttpService,
    private transactionsService: fromStore.TransactionsFacadeService
  ) {
    super();
  }

  ngOnInit() {}

  deleteTransaction(key: string) {
    const payload = { key, value: null, uid: this.uid };
    this.transactionsService.deleteTransaction(payload);
  }

  readTransactions(query: any) {
    this.user$.pipe(
      tap((response) => {
        this.transactionsService.readTransactions(response.uid, query);
        this.uid = response.uid;
      })
    ).subscribe();
  }

}
