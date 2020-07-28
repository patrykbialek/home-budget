import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonWithAnimationComponent } from '@shared/components';

import * as fromStore from '../../store';
import { AuthenticationHttpService } from '@authentication/services';
import { tap, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hb-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent extends CommonWithAnimationComponent implements OnDestroy, OnInit {

  uid: string;

  total$ = this.transactionsService.total$;
  transactions$ = this.transactionsService.transactions$;
  user$ = this.authenticationService.authState$;

  initQuery = {};

  private subscription$ = new Subscription();

  constructor(
    private authenticationService: AuthenticationHttpService,
    private transactionsService: fromStore.TransactionsFacadeService
  ) {
    super();
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

  ngOnInit() { }

  deleteTransaction(key: string) {
    const payload = { key, value: null, uid: this.uid };
    this.transactionsService.deleteTransaction(payload);
  }

  readTransactions(query: any) {
    this.subscription$.add(
      this.user$.pipe(
        filter(response => Boolean(response)),
        tap((response) => {
          this.transactionsService.readTransactions(response.uid, query);
          this.uid = response.uid;
        })
      ).subscribe()
    );
  }

}
