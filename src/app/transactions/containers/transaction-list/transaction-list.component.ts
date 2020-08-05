import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationHttpService } from '@authentication/services';
import { CommonWithAnimationComponent } from '@shared/components';
import { SharedUtilsService } from '@shared/services/shared-utils.service';
import { Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import * as fromStore from '../../store';

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
