import { Observable, from, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Auth, authState } from '@angular/fire/auth';
import { Database, list, object, objectVal, ref, remove, update } from '@angular/fire/database';

import * as fromModels from '@home-budget/plans/models';

@Injectable({ providedIn: 'root' })
export class PlansHttpService {

  private readonly auth = inject(Auth);
  private readonly db = inject(Database);
  private readonly injector = inject(Injector);
  private readonly uid = toSignal(
    authState(this.auth).pipe(map(user => user?.uid ?? '')),
    { initialValue: '' },
  );

  readYears(uid = this.uid()): Observable<string[]> {
    const path = `/workspaces/${uid}/plans`;
    return runInInjectionContext(this.injector, () => list(ref(this.db, path))).pipe(
      map(changes => changes
        .filter(change => change.snapshot.val()?.isActive === true)
        .map(change => change.snapshot.key)
        .filter(Boolean)
        .sort() as string[]
      ),
    );
  }

  readEntriesObject(sourcePath: string): Observable<unknown> {
    const path = `/workspaces/${this.uid()}/plans/${sourcePath}`;
    return runInInjectionContext(this.injector, () => objectVal(ref(this.db, path)));
  }

  readData(sourcePath?: string): Observable<fromModels.DataEntry[]> {
    const path = `/workspaces/${this.uid()}/plans/${sourcePath}`;
    return runInInjectionContext(this.injector, () => list(ref(this.db, path))).pipe(
      map(changes => changes.map(change => ({
        key: change.snapshot.key,
        ...change.snapshot.val(),
      }))),
      map(items => items.sort(this.compare)),
    );
  }

  readDataByType(sourcePath: string): Observable<unknown> {
    const path = `/workspaces/${this.uid()}/plans/${sourcePath}`;
    return runInInjectionContext(this.injector, () => list(ref(this.db, path))).pipe(
      map(changes => changes.map(change => ({
        key: change.snapshot.key,
        ...change.snapshot.val(),
      }))),
      map(items => items.sort(this.compare)),
    );
  }

  readDataByTypeObject(sourcePath: string): Observable<unknown> {
    const path = `/workspaces/${this.uid()}/plans/${sourcePath}`;
    return runInInjectionContext(this.injector, () => object(ref(this.db, path))).pipe(
      map(change => ({
        key: change.snapshot.key,
        value: change.snapshot.val(),
      })),
    );
  }

  updateEntriesObject(updatePath: string, payload: Record<string, unknown>): void {
    const path = `/workspaces/${this.uid()}/plans/${updatePath}`;
    update(ref(this.db, path), payload);
  }

  updateEntry(payload: fromModels.UpadatePayload): Observable<void> {
    const { entry, isInTotal, label, notes, path, order, total } = payload;
    const updatedPath = `/workspaces/${this.uid()}/plans/${path}/${entry}`;
    return from(update(ref(this.db, updatedPath), { isInTotal, label, notes, order, total }));
  }

  updateEntryLabel(payload: fromModels.UpadatePayload): Observable<void> {
    const { entry, label, path } = payload;
    const updatedPath = `/workspaces/${this.uid()}/plans/${path}/${entry}`;
    return from(update(ref(this.db, updatedPath), { label }));
  }

  updateParentEntry(payload: fromModels.UpadatePayload): Observable<void> {
    const { entry, path, total } = payload;
    const updatedPath = `/workspaces/${this.uid()}/plans/${path}/${entry}`;
    return from(update(ref(this.db, updatedPath), { total }));
  }

  deleteEntry(updatePath: string): Observable<void> {
    const path = `/workspaces/${this.uid()}/plans/${updatePath}`;
    return from(remove(ref(this.db, path)));
  }

  private compare(first, second) {
    const orderFirst = first.date;
    const orderSecond = second.date;
    if (orderFirst < orderSecond) return 1;
    if (orderFirst > orderSecond) return -1;
    return 0;
  }
}
