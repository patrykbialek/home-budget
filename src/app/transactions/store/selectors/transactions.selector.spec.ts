import { TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { Transaction, TransactionType } from '@transactions/models';
import * as fromActions from '../actions/index';
import * as fromReducers from '../reducers/index';
import * as fromSelectors from '../selectors/transactions.selector';
import * as fromRoot from '@shared/store';
import { Router } from '@angular/router';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { CustomSerializer } from '@shared/store';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';

@Component({
  template: ``
})
class ListMockComponent { }

fdescribe('Transactions Selectors', () => {
  let store: Store<fromReducers.MainState>;
  let router: Router;

  const transactions: Transaction[] = [
    {
      account: null,
      amount: 200,
      category: null,
      date: null,
      inBugdet: null,
      key: '-MDd0qfiz9eSRd4z2RXJ',
      recipient: null,
      type: TransactionType.Income,
    },
    {
      account: null,
      amount: 200,
      category: null,
      date: null,
      inBugdet: null,
      key: '-MDd0qfiz9eSRd4z2RXK',
      recipient: null,
      type: TransactionType.Expense,
    },
  ];

  const entities = transactions;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{
          path: 'transactions/:key',
          component: ListMockComponent
        }]),
        StoreModule.forRoot({
          ...fromRoot.reducers,
          transactions: combineReducers(fromReducers.reducers),
        }),
        // StoreModule.forRoot({
        //   router: combineReducers(fromReducers.reducers)
        // }),
        StoreRouterConnectingModule.forRoot({
          stateKey: 'router',
        }),
      ],
      providers: [
        {
          provide: RouterStateSerializer,
          useClass: CustomSerializer,
        },
      ]
    });

    store = TestBed.get(Store);
    router = TestBed.get(Router);
  });

  describe('getTransactionsState', () => {
    it('should return state of transactions store slice', () => {
      let result;

      store
        .select(fromSelectors.getTransactionsState)
        .subscribe(value => (result = value));

      expect(result).toEqual({
        entities: [],
        isFailed: false,
        isLoading: false,
        isSuccess: false,
      });

      store.dispatch(new fromActions.ReadTransactionsSuccess(transactions));

      expect(result).toEqual({
        entities,
        isFailed: false,
        isLoading: false,
        isSuccess: true,
      });
    });
  });

  describe('getIsSuccess', () => {
    it('should return the transactions isSuccess state', () => {
      let result;

      store
        .select(fromSelectors.getIsSuccess)
        .subscribe(value => (result = value));

      expect(result).toEqual(false);

      store.dispatch(new fromActions.ReadTransactionsSuccess([]));

      expect(result).toEqual(true);
    });
  });

  // TODO: Finish that test soon!!!!!!
  describe('getSelectedTransaction', () => {
    it('should return selected transaction as an entity', () => {
      let result;
      let params;

      store.dispatch(new fromActions.ReadTransactionsSuccess(transactions));

      store.dispatch({
        type: 'ROUTER_NAVIGATION',
        payload: {
          routerState: {
            url: '/transactions/-MDd0qfiz9eSRd4z2RXJ',
            queryParams: {},
            params: {
              key: '-MDd0qfiz9eSRd4z2RXJ'
            }
          },
          event: {},
        },
      });

      // store
      //   .select(fromRoot.getRouterState)
      //   .subscribe(routerState => {
      //     (params = routerState.state.params)
      //   });

      // expect(params).toEqual({ key: '123' });

      // store
      //   .select(fromSelectors.getTransactionsState)
      //   .subscribe(transactions => {
      //     // (result = selectedTransaction)
      //     console.log(transactions.entities)
      //   });

      // expect(result).toEqual(entities[0]);
    });
  });

  describe('getTransactions', () => {
    it('should return the transactions collection state', () => {
      let result;

      store
        .select(fromSelectors.getTransactions)
        .subscribe(value => (result = value));

      store.dispatch(new fromActions.ReadTransactionsSuccess([]));
      expect(result.length).toEqual(0);
    });
  });

  describe('getTotal', () => {
    it('should return the transactions total state', () => {
      let result;

      store
        .select(fromSelectors.getTotal)
        .subscribe(value => (result = value));

      store.dispatch(new fromActions.ReadTransactionsSuccess([]));

      expect(result.all.toString().substring(0, 5))
        .toEqual((0.001).toString().substring(0, 5));

      store
        .select(fromSelectors.getTotal)
        .subscribe(value => (result = value));

      store.dispatch(new fromActions.ReadTransactionsSuccess(transactions.filter(transaction => transaction.type === TransactionType.Income)));

      expect(result.all).toEqual(200.001);

      store
        .select(fromSelectors.getTotal)
        .subscribe(value => (result = value));

      store.dispatch(new fromActions.ReadTransactionsSuccess(transactions));

      expect(result.all.toString().substring(0, 5))
        .toEqual((0.001).toString().substring(0, 5));
    });
  });

});
