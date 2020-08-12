import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationHttpService } from '@authentication/services';
import { CommonWithAnimationComponent } from '@home-budget/shared/components';
import { SharedUtilsService } from '@home-budget/shared/services/shared-utils.service';
import { Query } from '@home-budget/transactions/models';
import * as fromStore from '@home-budget/transactions/store';
import { Subscription } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';

@Component({
  selector: 'hb-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent extends CommonWithAnimationComponent implements OnDestroy, OnInit {

  uid: string;

  isLoading$ = this.transactionsService.isLoading$;
  total$ = this.transactionsService.total$;
  transactions$ = this.transactionsService.transactions$;
  user$ = this.authenticationService.authState$;
  windowSize$ = this.sharedUtilsService.windowSize$;

  initQuery = {};

  private subscription$ = new Subscription();

  constructor(
    private authenticationService: AuthenticationHttpService,
    private sharedUtilsService: SharedUtilsService,
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
    this.transactionsService.deleteTransactionFromList(payload);
  }

  readTransactions(query: Query) {
    this.subscription$.add(
      this.user$.pipe(
        take(1),
        filter(response => Boolean(response)),
        tap((response) => {
          const payload = {
            uid: response.uid,
            query
          };
          this.transactionsService.readTransactions(payload);
          this.uid = response.uid;
        })
      ).subscribe()
    );
  }

}
