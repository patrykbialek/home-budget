import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AuthenticationHttpService } from '@home-budget/authentication/services';
import * as fromModels from '@home-budget/transactions/models';

@Injectable({
  providedIn: 'root'
})
export class PlanHttpService {
  user$ = this.authenticationService.authState$;

  constructor(
    private db: AngularFireDatabase,
    private authenticationService: AuthenticationHttpService,
  ) { }

  // Create

  initiatePlan(year: string) {
    const uid: string = 'Pmj8IO7zkJeFDmtqSYHzE0A38in1';
    const path: string = `/workspaces/${uid}/plans`;
    const db: AngularFireList<any> = this.db.list(path);
    const value = this.initialDataEntry(year);
    return of(db.update(year, value));
  }

  createPlan(payload: any) {
    const uid: string = 'Pmj8IO7zkJeFDmtqSYHzE0A38in1';
    const path: string = `/workspaces/${uid}/plans`;
    const db: AngularFireList<any> = this.db.list(path);
    const value = {
      label: payload.label,
      path: payload.path,
    };
    return of(db.update(payload.uid, value));
  }

  private initialDataEntry(label): any {
    return {
      label,
      ['entries']: {
        project: {
          label: 'Projekt',
          entries: this.dataProjectEntries(`${label}/entries/project`),
          path: `${label}/project/entries`,
        },
        execution: {
          label: 'Wykonanie',
          entries: this.dataProjectEntries(`${label}/entries/execution`),
          path: `${label}/execution/entries`,
        }
      }
    }
  }

  private dataProjectEntries(parentPath: string): any {
    return {
      'incomes': {
        entries: {
          ['jan']: this.dataProjectEntry('jan', 'Styczeń', parentPath,1,'incomes'),
          ['feb']: this.dataProjectEntry('feb', 'Luty', parentPath,2 ,'incomes'),
          ['mar']: this.dataProjectEntry('mar', 'Marzec', parentPath,3 ,'incomes'),
          ['apr']: this.dataProjectEntry('apr', 'Kwiecień', parentPath,4, 'incomes'),
          ['may']: this.dataProjectEntry('may', 'Maj', parentPath,5 ,'incomes'),
          ['jun']: this.dataProjectEntry('jun', 'Czerwiec', parentPath,6, 'incomes'),
          ['jul']: this.dataProjectEntry('jul', 'Lipiec', parentPath,7 ,'incomes'),
          ['aug']: this.dataProjectEntry('aug', 'Sierpień', parentPath,8,'incomes'),
          ['sep']: this.dataProjectEntry('sep', 'Wrzesień', parentPath,9 ,'incomes'),
          ['oct']: this.dataProjectEntry('oct', 'Paździenik', parentPath,10, 'incomes'),
          ['nov']: this.dataProjectEntry('nov', 'Listopad', parentPath,11 ,'incomes'),
          ['dec']: this.dataProjectEntry('dec', 'Grudzień', parentPath,12, 'incomes'),
        },
        isInTotal: false,
        label: 'Przychody',
        total: 0,
        path: `${parentPath}/entries/incomes`,
      },
      'expenses': {
        entries: {
          ['jan']: this.dataProjectExpenseEntry('jan', 'Styczeń', parentPath,1, 'expenses'),
          ['feb']: this.dataProjectExpenseEntry('feb', 'Luty', parentPath,2, 'expenses'),
          ['mar']: this.dataProjectExpenseEntry('mar', 'Marzec', parentPath,3, 'expenses'),
          ['apr']: this.dataProjectExpenseEntry('apr', 'Kwiecień', parentPath,4, 'expenses'),
          ['may']: this.dataProjectExpenseEntry('may', 'Maj', parentPath,5, 'expenses'),
          ['jun']: this.dataProjectExpenseEntry('jun', 'Czerwiec', parentPath,6, 'expenses'),
          ['jul']: this.dataProjectExpenseEntry('jul', 'Lipiec', parentPath,7, 'expenses'),
          ['aug']: this.dataProjectExpenseEntry('aug', 'Sierpień', parentPath,8, 'expenses'),
          ['sep']: this.dataProjectExpenseEntry('sep', 'Wrzesień', parentPath,9, 'expenses'),
          ['oct']: this.dataProjectExpenseEntry('oct', 'Paździenik', parentPath,10, 'expenses'),
          ['nov']: this.dataProjectExpenseEntry('nov', 'Listopad', parentPath,11, 'expenses'),
          ['dec']: this.dataProjectExpenseEntry('dec', 'Grudzień', parentPath,12, 'expenses'),
        },
        isInTotal: false,
        label: 'Wydatki',
        path: `${parentPath}/entries/expenses`,
        total: 0,
      }
    }
  }

  private dataProjectExpenseEntry(uid: string, label: string, parentPath: string, order: number, type: string): any {
    return {
      order,
      entries: {
        loans: {
          isInTotal: true,
          label: 'Raty',
          total: 2300,
        },
        budget: {
          isInTotal: true,
          label: 'Budzet',
          total: 11000,
        },
        other: {
          isInTotal: true,
          label: 'Rózne',
          total: 1000,
        },
        taxVat: {
          isInTotal: true,
          label: 'VAT',
          total: 1000,
        },
        taxPit: {
          isInTotal: true,
          label: 'PIT',
          total: 1000,
        },
      },
      isInTotal: false,
      label: label,
      total: 0,
      path: `${parentPath}/entries/${type}/`,
    }
  }

  private dataProjectEntry(uid: string, label: string, parentPath: string, order: number, type: string): any {
    return {
      order,
      entries: {
        patryk: {
          isInTotal: true,
          label: 'Patryk',
          total: 1230,
        },
        gosia: {
          isInTotal: true,
          label: 'Gosia',
          total: 2314,
        },
        other: {
          isInTotal: true,
          label: '500+',
          total: 1000,
        },
      },
      isInTotal: false,
      label: label,
      total: 0,
      path: `${parentPath}/entries/${type}/`,
    }
  }

  // Delete

  deleteTransaction(payload: fromModels.TransactionPayload) {
    const db: AngularFireList<any> = this.db.list(`/workspaces/${payload.uid}/transactions`);
    const key = payload.key;
    return of(db.remove(key));
  }

  // Read

  readData(): Observable<any> {
    const uid: string = 'Pmj8IO7zkJeFDmtqSYHzE0A38in1';
    const path: string = `/workspaces/${uid}/plans`;
    const db: AngularFireList<any> = this.db.list(path);
    return db.snapshotChanges().pipe(
      map((changes) =>
        changes.map((change) => ({ key: change.payload.key, ...change.payload.val() }))
      ),
      map(items => {
        return items.sort(this.compare);
      }),
    );
  }

  readDataByType(sourcePath: string): Observable<any> {
    const uid: string = "Pmj8IO7zkJeFDmtqSYHzE0A38in1";
    const path: string = `/workspaces/${uid}/plans/${sourcePath}`;
    const db: AngularFireList<any> = this.db.list(path);
    return db.snapshotChanges().pipe(
      map((changes) =>
        changes.map((change) => ({
          key: change.payload.key,
          ...change.payload.val(),
        }))
      ),
      map((items) => {
        return items.sort(this.compare);
      })
    );
  }

  readTransactions(params: fromModels.TransactionParams) {
    let db: AngularFireList<any>;
    const query = params.query;
    const uid = params.uid;

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
