import { Injectable } from '@angular/core';

import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/database';
import { map, delay, tap, switchMap, mergeMap } from 'rxjs/operators';

import * as moment from 'moment';

import * as fromModels from '../models';
import { of, forkJoin, combineLatest } from 'rxjs';
import { AuthenticationHttpService } from '@authentication/services';

@Injectable({
  providedIn: 'root'
})
export class TransactionsHttpService {
  user$ = this.authenticationService.authState$;

  constructor(
    private db: AngularFireDatabase,
    private authenticationService: AuthenticationHttpService,
  ) { }

  // Create

  createTransaction(payload: fromModels.TransactionPayload) {
    const db: AngularFireList<any> = this.db.list(`/workspaces/${payload.uid}/transactions`);
    const value = this.prepareTransactionPayload(payload.value);
    return of(db.push(value));
  }

  // Delete

  deleteTransaction(payload: fromModels.TransactionPayload) {
    const db: AngularFireList<any> = this.db.list(`/workspaces/${payload.uid}/transactions`);
    const key = payload.key;
    return of(db.remove(key));
  }

  // Read

  readTransactions(payload: any) {
    let db: AngularFireList<any>;
    const query = payload.query;
    const uid = payload.uid;

    if (query.category && query.periodFrom) {
      db = this.db.list(`/workspaces/${uid}/transactions`, ref =>
        (query.category && query.periodFrom)
          ? ref.orderByChild('category_date')
            .startAt(`${query.category}_${query.periodFrom}`)
            .endAt(`${query.category}_${query.periodTo}`)
          : ref
      );
    }

    if (!query.category && query.periodFrom) {
      db = this.db.list(`/workspaces/${uid}/transactions`, ref =>
        (query.periodFrom)
          ? ref.orderByChild('date')
            .startAt(`${query.periodFrom}`)
            .endAt(`${query.periodTo}`)
          : ref
      );
    }

    if (query.category && !query.periodFrom) {
      db = this.db.list(`/workspaces/${uid}/transactions`, ref =>
        (query.category && !query.periodFrom)
          ? ref.orderByChild('category')
            .equalTo(`${query.category}`)
          : ref
      );
    }

    if (db) {
      return db.snapshotChanges().pipe(
        map((changes) =>
          changes.map((change) => ({ key: change.payload.key, ...change.payload.val() }))
        ),
        map(items => {
          return items.sort(this.compare);
        }),
      );
    } else {
      return of([]);
    }
  }

  // Update

  updateTransaction(payload: fromModels.TransactionPayload) {
    const db: AngularFireList<any> = this.db.list(`/workspaces/${payload.uid}/transactions`);
    const key = payload.key;
    const value = this.prepareTransactionPayload(payload.value);
    return of(db.update(key, value));
  }

  private compare(first, second) {
    const orderFirst = first.date;
    const orderSecond = second.date;

    let comparison = 0;
    if (orderFirst < orderSecond) {
      comparison = 1;
    } else if (orderFirst > orderSecond) {
      comparison = -1;
    }
    return comparison;
  }

  private prepareTransactionPayload(data: any) {
    const category = data.category.name;
    const date = moment(data.date).format('YYYY-MM-DD');

    data = {
      ...data,
      category,
      category_date: `${category}_${date}`,
      date,
    };
    return data;
  }

}
