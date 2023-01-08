import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import * as fromModels from '@home-budget/plans/models';

const uid: string = 'Pmj8IO7zkJeFDmtqSYHzE0A38in1';

@Injectable({ providedIn: 'root' })
export class PlansHttpService {

  constructor(
    private db: AngularFireDatabase,
  ) { }

  // Create

  // initiatePlan(year: string) {
  //   const path: string = `/workspaces/${uid}/plans`;
  //   const db: AngularFireList<any> = this.db.list(path);
  //   const value = this.initialDataEntry(year);
  //   return of(db.update(year, value));
  // }

  // createPlan(payload: any) {
  //   const path: string = `/workspaces/${uid}/plans`;
  //   const db: AngularFireList<any> = this.db.list(path);
  //   const value = {
  //     label: payload.label,
  //     path: payload.path,
  //   };
  //   return of(db.update(payload.uid, value));
  // }

  // Read

  readEntriesObject(sourcePath: string): any {
    const path: string = `/workspaces/${uid}/plans/${sourcePath}`;
    const db: AngularFireObject<any> = this.db.object(path);
    return db.valueChanges();
  }

  readData(sourcePath?: string): Observable<fromModels.DataEntry[]> {
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

  readDataByType(sourcePath: string): Observable<any> {
    const path: string = `/workspaces/${uid}/plans/${sourcePath}`;
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
    const path: string = `/workspaces/${uid}/plans/${sourcePath}`;
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
    const path: string = `/workspaces/${uid}/plans/${updatePath}`;
    const db: AngularFireObject<any> = this.db.object(path);
    db.update(payload);
  }

  updateEntry(payload: fromModels.UpadatePayload): Observable<any> {
    const { entry, isInTotal, label, notes, path, order, total } = payload;
    const updatedPath: string = `/workspaces/${uid}/plans/${path}`;
    const db: AngularFireList<any> = this.db.list(updatedPath);
    return of(db.update(entry, { isInTotal, label, notes, order, total }));
  }

  updateEntryLabel(payload: fromModels.UpadatePayload): Observable<any> {
    const { entry, label, path } = payload;
    const updatedPath: string = `/workspaces/${uid}/plans/${path}`;
    const db: AngularFireList<any> = this.db.list(updatedPath);
    return of(db.update(entry, { label }));
  }

  updateParentEntry(payload: fromModels.UpadatePayload): Observable<any> {
    const { entry, path, total } = payload;
    const updatedPath: string = `/workspaces/${uid}/plans/${path}`;
    const db: AngularFireList<any> = this.db.list(updatedPath);
    return of(db.update(entry, { total }));
  }

  // Delete

  deleteEntry(updatePath: string): Observable<any> {
    const path: string = `/workspaces/${uid}/plans/${updatePath}`;
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

  // private initialDataEntry(label): any {
  //   let entries = {};
  //   months.forEach((month: any, index: number) => {
  //     entries = {
  //       ...entries,
  //       [month.key]: {
  //         ['entries']: {
  //           project: {
  //             label: 'Projekt',
  //             entries: this.dataProjectEntries(
  //               `${label}/entries/project`,
  //               month.key,
  //               month.value
  //             ),
  //             path: `${label}/project/entries`,
  //           },
  //           execution: {
  //             label: 'Wykonanie',
  //             entries: this.dataProjectEntries(
  //               `${label}/entries/execution`,
  //               month.key,
  //               month.value
  //             ),
  //             path: `${label}/execution/entries`,
  //           },
  //         },
  //         label: month.value,
  //         order: index,
  //       },
  //     };
  //   });

  //   return {
  //     label,
  //     ['entries']: entries,
  //   };
  // }

  // private dataProjectEntries(
  //   parentPath: string,
  //   monthId: string,
  //   month: string
  // ): any {
  //   return {
  //     income: {
  //       entries: this.dataProjectIncomeEntry(
  //         monthId,
  //         month,
  //         parentPath,
  //         1,
  //         'income'
  //       ),
  //       isInTotal: false,
  //       label: 'Przychody',
  //       total: 0,
  //       path: `${parentPath}/entries`,
  //     },
  //     expense: {
  //       entries: this.dataProjectExpenseEntry(
  //         monthId,
  //         month,
  //         parentPath,
  //         1,
  //         'expense'
  //       ),
  //       isInTotal: false,
  //       label: 'Wydatki',
  //       path: `${parentPath}/entries`,
  //       total: 0,
  //     },
  //   };
  // }

  // private dataProjectExpenseEntry(): any {
  //   return {
  //     expense01: {
  //       isInTotal: true,
  //       label: 'Budżet',
  //       total: 11000,
  //       order: 0,
  //     },
  //     expense02: {
  //       entries: {
  //         expense0201: {
  //           isInTotal: true,
  //           label: 'Ekspres',
  //           total: 133.3,
  //           order: 0,
  //         },
  //         expense0202: {
  //           isInTotal: true,
  //           label: 'AGD',
  //           total: 372.39,
  //           order: 1,
  //         },
  //         expense0203: {
  //           isInTotal: true,
  //           label: 'Blender',
  //           total: 9.02,
  //           order: 2,
  //         },
  //         expense0204: {
  //           isInTotal: true,
  //           label: 'Krzesła',
  //           total: 110.09,
  //           order: 3,
  //         },
  //         expense0205: {
  //           isInTotal: true,
  //           label: 'Stoliki',
  //           total: 79.85,
  //           order: 4,
  //         },
  //         expense0206: {
  //           isInTotal: true,
  //           label: 'Szafka',
  //           total: 206.5,
  //           order: 5,
  //         },
  //         expense0207: {
  //           isInTotal: true,
  //           label: 'Suszarka',
  //           total: 99.95,
  //           order: 6,
  //         },
  //         expense0208: {
  //           isInTotal: true,
  //           label: 'Komoda',
  //           total: 161.9,
  //           order: 7,
  //         },
  //       },
  //       isInTotal: true,
  //       label: 'Raty',
  //       total: 2300,
  //       order: 1,
  //     },
  //     expense03: {
  //       entries: {
  //         expense0301: {
  //           entries: {
  //             expense030101: {
  //               isInTotal: true,
  //               label: 'Moto 1',
  //               total: 2000,
  //               order: 0,
  //             },
  //             expense030102: {
  //               entries: {
  //                 expense03010201: {
  //                   isInTotal: true,
  //                   label: 'Triumph',
  //                   total: 38000,
  //                   order: 0,
  //                 },
  //                 expense03010202: {
  //                   isInTotal: true,
  //                   label: 'Kask',
  //                   total: 2000,
  //                   order: 1,
  //                 },
  //               },
  //               isInTotal: true,
  //               label: 'Moto 2',
  //               total: 40000,
  //               order: 1,
  //             },
  //           },
  //           isInTotal: true,
  //           label: 'Patryk',
  //           total: 2000,
  //           order: 0,
  //         },
  //         expense0302: {
  //           isInTotal: true,
  //           label: 'Gosia',
  //           total: 1200,
  //           order: 1,
  //         },
  //         expense0303: {
  //           entries: {
  //             expense030301: {
  //               isInTotal: true,
  //               label: 'Lato',
  //               total: 1000,
  //               order: 0,
  //             },
  //             expense030302: {
  //               isInTotal: true,
  //               label: 'Niemcy',
  //               total: 1000,
  //               order: 1,
  //             },
  //             expense030303: {
  //               isInTotal: true,
  //               label: 'Francja',
  //               total: 1000,
  //               order: 2,
  //             },
  //             expense030304: {
  //               isInTotal: true,
  //               label: 'Weekend',
  //               total: 1000,
  //               order: 3,
  //             },
  //           },
  //           isInTotal: true,
  //           label: 'Wakacje',
  //           total: 4000,
  //           order: 2,
  //         },
  //         expense0304: {
  //           entries: {
  //             expense030401: {
  //               isInTotal: true,
  //               label: 'BMW X3',
  //               total: 0,
  //               order: 0,
  //             },
  //             expense030402: {
  //               isInTotal: true,
  //               label: 'BMW 3',
  //               total: 0,
  //               order: 1,
  //             },
  //             expense030403: {
  //               isInTotal: true,
  //               label: 'Brixton',
  //               total: 0,
  //               order: 2,
  //             },
  //             expense030404: {
  //               isInTotal: true,
  //               label: 'Triumph',
  //               total: 0,
  //               order: 3,
  //             },
  //             expense030405: {
  //               isInTotal: true,
  //               label: 'Rózne 1',
  //               total: 0,
  //               order: 4,
  //             },
  //             expense030406: {
  //               isInTotal: true,
  //               label: 'Rózne 2',
  //               total: 0,
  //               order: 5,
  //             },
  //             expense030407: {
  //               isInTotal: true,
  //               label: 'Rózne 3',
  //               total: 0,
  //               order: 6,
  //             },
  //             expense030408: {
  //               isInTotal: true,
  //               label: 'Emerytura',
  //               total: 0,
  //               order: 7,
  //             },
  //           },
  //           isInTotal: true,
  //           label: 'Dom',
  //           total: 1200,
  //           order: 3,
  //         },
  //       },
  //       isInTotal: true,
  //       label: 'Różne',
  //       total: 1000,
  //       order: 2,
  //     },
  //     expense04: {
  //       entries: {
  //         expense0401: {
  //           isInTotal: true,
  //           label: '2022',
  //           total: 0,
  //           order: 0,
  //         },
  //         expense0402: {
  //           isInTotal: true,
  //           label: '2023',
  //           total: 0,
  //           order: 1,
  //         },
  //       },
  //       isInTotal: true,
  //       label: 'VAT',
  //       total: 1000,
  //       order: 3,
  //     },
  //     expense05: {
  //       entries: {
  //         expense0501: {
  //           isInTotal: true,
  //           label: '2022',
  //           total: 0,
  //           order: 0,
  //         },
  //         expense0502: {
  //           isInTotal: true,
  //           label: '2023',
  //           total: 0,
  //           order: 1,
  //         },
  //       },
  //       isInTotal: true,
  //       label: 'PIT',
  //       total: 1000,
  //       order: 4,
  //     },
  //   };
  // }

  // private dataProjectIncomeEntry(
  //   uid: string,
  //   label: string,
  //   parentPath: string,
  //   order: number,
  //   type: string
  // ): any {
  //   return {
  //     income01: {
  //       isInTotal: true,
  //       label: 'Patryk',
  //       total: 21300,
  //       order: 0,
  //     },
  //     income02: {
  //       isInTotal: true,
  //       label: 'Gosia',
  //       total: 3960,
  //       order: 1,
  //     },
  //     income03: {
  //       isInTotal: true,
  //       label: '500+',
  //       total: 1000,
  //       order: 2,
  //     },
  //   };
  // }

}
