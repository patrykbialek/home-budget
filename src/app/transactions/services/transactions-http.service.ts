import { Injectable } from "@angular/core";

import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/database';
import { map, delay, tap, switchMap, mergeMap } from 'rxjs/operators';

import * as moment from 'moment';

import * as fromModels from '../models';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionsHttpService {

  constructor(
    private db: AngularFireDatabase,
  ) { }

  // Create
  
  createTransaction(payload: any) {
    const db: AngularFireList<any> = this.db.list(`/transactions`);
    const category = payload.category.name;
    const date = moment(payload.date).format('YYYY-MM-DD');
    
    payload = {
      ...payload,
      category,
      category_date: `${category}_${date}`,
      date,
    };
    return of(db.push(payload));
  }

  // Delete
  
  deleteTransaction(payload: any) {
    const db: AngularFireList<any> = this.db.list(`/transactions`);

    return of(db.remove(payload.key));
  }

  // Read

  readTransactions(query: fromModels.Query) {
    let db: AngularFireList<any>;

    if (query.category && query.periodFrom) {
      db = this.db.list(`/transactions`, ref =>
        (query.category && query.periodFrom)
          ? ref.orderByChild('category_date')
            .startAt(`${query.category}_${query.periodFrom}`)
            .endAt(`${query.category}_${query.periodTo}`)
          : ref
      );
    }

    if (!query.category && query.periodFrom) {
      db = this.db.list(`/transactions`, ref =>
        (query.periodFrom)
          ? ref.orderByChild('date')
            .startAt(`${query.periodFrom}`)
            .endAt(`${query.periodTo}`)
          : ref
      );
    }

    if (query.category && !query.periodFrom) {
      db = this.db.list(`/transactions`, ref =>
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

}