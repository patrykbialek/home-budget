import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';

import * as fromModels from '@home-budget/plans/models';

@Injectable({ providedIn: 'root' })
export class PlansHttpService {

  private uid: string;

  constructor(
    private db: AngularFireDatabase,
  ) {
    this.uid = localStorage.getItem('uid');
  }

  // Create

  // initiatePlan(year: string) {
  //   const path: string = `/workspaces/${this.uid}/plans`;
  //   const db: AngularFireList<any> = this.db.list(path);
  //   const value = this.initialDataEntry(year);
  //   return of(db.update(year, value));
  // }

  // createPlan(payload: any) {
  //   const path: string = `/workspaces/${this.uid}/plans`;
  //   const db: AngularFireList<any> = this.db.list(path);
  //   const value = {
  //     label: payload.label,
  //     path: payload.path,
  //   };
  //   return of(db.update(payload.uid, value));
  // }

  // Read

  readEntriesObject(sourcePath: string): any {
    const path: string = `/workspaces/${this.uid}/plans/${sourcePath}`;
    const db: AngularFireObject<any> = this.db.object(path);
    return db.valueChanges();
  }

  readData(sourcePath?: string): Observable<fromModels.DataEntry[]> {
    const path: string = `/workspaces/${this.uid}/plans/${sourcePath}`;
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

  readDataByType(sourcePath: string): Observable<any> {
    const path: string = `/workspaces/${this.uid}/plans/${sourcePath}`;
    const db: AngularFireList<any> = this.db.list(path);
    return db.snapshotChanges()
      .pipe(
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

  readDataByTypeObject(sourcePath: string): Observable<any> {
    const path: string = `/workspaces/${this.uid}/plans/${sourcePath}`;
    const db: AngularFireObject<any> = this.db.object(path);
    return db.snapshotChanges()
      .pipe(
        map((changes) => {
          return {
            key: changes.payload.key,
            value: changes.payload.val(),
          };
        }),
      );
  }

  // Update

  updateEntriesObject(updatePath: string, payload: any): void {
    const path: string = `/workspaces/${this.uid}/plans/${updatePath}`;
    const db: AngularFireObject<any> = this.db.object(path);
    db.update(payload);
  }

  updateEntry(payload: fromModels.UpadatePayload): Observable<any> {
    const { entry, isInTotal, label, notes, path, order, total } = payload;
    const updatedPath: string = `/workspaces/${this.uid}/plans/${path}`;
    const db: AngularFireList<any> = this.db.list(updatedPath);
    return of(db.update(entry, { isInTotal, label, notes, order, total }));
  }

  updateEntryLabel(payload: fromModels.UpadatePayload): Observable<any> {
    const { entry, label, path } = payload;
    const updatedPath: string = `/workspaces/${this.uid}/plans/${path}`;
    const db: AngularFireList<any> = this.db.list(updatedPath);
    return of(db.update(entry, { label }));
  }

  updateParentEntry(payload: fromModels.UpadatePayload): Observable<any> {
    const { entry, path, total } = payload;
    const updatedPath: string = `/workspaces/${this.uid}/plans/${path}`;
    const db: AngularFireList<any> = this.db.list(updatedPath);
    return of(db.update(entry, { total }));
  }

  // Delete

  deleteEntry(updatePath: string): Observable<any> {
    const path: string = `/workspaces/${this.uid}/plans/${updatePath}`;
    const db: AngularFireObject<any> = this.db.object(path);
    return of(db.remove());
  }

  // Utils

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
