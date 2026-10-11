import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Auth, authState } from '@angular/fire/auth';
import { Database, list, object, objectVal, ref, remove, update } from '@angular/fire/database';

import { DataEntry, UpdatePayload } from '@home-budget/finance/models';

/**
 * Stateless Firebase I/O for the finance feature. Provided in root so the global
 * app-header (year selector) can use it too. The `collection` (`plans` | `finances`)
 * is passed per call by the collection-scoped {@link FinanceService}, rather than
 * injected, so a single root instance serves both feature instances.
 */
@Injectable({ providedIn: 'root' })
export class FinanceHttpService {

  private readonly auth = inject(Auth);
  private readonly db = inject(Database);
  private readonly injector = inject(Injector);
  private readonly uid = toSignal(
    authState(this.auth).pipe(map(user => user?.uid ?? '')),
    { initialValue: '' },
  );

  readYears(uid = this.uid(), collection = 'plans'): Observable<string[]> {
    const path = `/workspaces/${uid}/${collection}`;
    return runInInjectionContext(this.injector, () => list(ref(this.db, path))).pipe(
      map(changes => changes
        .filter(change => change.snapshot.val()?.isActive === true)
        .map(change => change.snapshot.key)
        .filter(Boolean)
        .sort() as string[]
      ),
    );
  }

  readEntriesObject(collection: string, sourcePath: string): Observable<unknown> {
    const path = `/workspaces/${this.uid()}/${collection}/${sourcePath}`;
    return runInInjectionContext(this.injector, () => objectVal(ref(this.db, path)));
  }

  readData(collection: string, sourcePath?: string, uid = this.uid()): Observable<DataEntry[]> {
    const path = `/workspaces/${uid}/${collection}/${sourcePath}`;
    return runInInjectionContext(this.injector, () => list(ref(this.db, path))).pipe(
      map(changes => changes.map(change => ({
        key: change.snapshot.key,
        ...change.snapshot.val(),
      }))),
      map(items => items.sort(this.compare)),
    );
  }

  readDataByType(collection: string, sourcePath: string): Observable<unknown> {
    const path = `/workspaces/${this.uid()}/${collection}/${sourcePath}`;
    return runInInjectionContext(this.injector, () => list(ref(this.db, path))).pipe(
      map(changes => changes.map(change => ({
        key: change.snapshot.key,
        ...change.snapshot.val(),
      }))),
      map(items => items.sort(this.compare)),
    );
  }

  readDataByTypeObject(collection: string, sourcePath: string): Observable<unknown> {
    const path = `/workspaces/${this.uid()}/${collection}/${sourcePath}`;
    return runInInjectionContext(this.injector, () => object(ref(this.db, path))).pipe(
      map(change => ({
        key: change.snapshot.key,
        value: change.snapshot.val(),
      })),
    );
  }

  updateEntriesObject(collection: string, updatePath: string, payload: Record<string, unknown>): Observable<void> {
    const path = `/workspaces/${this.uid()}/${collection}/${updatePath}`;
    return from(update(ref(this.db, path), payload));
  }

  updateEntry(collection: string, payload: UpdatePayload): Observable<void> {
    const { entry, isInTotal, label, notes, path, order, total } = payload;
    const updatedPath = `/workspaces/${this.uid()}/${collection}/${path}/${entry}`;
    return from(update(ref(this.db, updatedPath), { isInTotal, label, notes, order, total }));
  }

  updateEntryLabel(collection: string, payload: UpdatePayload): Observable<void> {
    const { entry, label, path } = payload;
    const updatedPath = `/workspaces/${this.uid()}/${collection}/${path}/${entry}`;
    return from(update(ref(this.db, updatedPath), { label }));
  }

  updateParentEntry(collection: string, payload: UpdatePayload): Observable<void> {
    const { entry, path, total } = payload;
    const updatedPath = `/workspaces/${this.uid()}/${collection}/${path}/${entry}`;
    return from(update(ref(this.db, updatedPath), { total }));
  }

  deleteEntry(collection: string, updatePath: string): Observable<void> {
    const path = `/workspaces/${this.uid()}/${collection}/${updatePath}`;
    return from(remove(ref(this.db, path)));
  }

  private compare(first: DataEntry, second: DataEntry): number {
    const orderFirst = (first as { date?: string | number }).date ?? '';
    const orderSecond = (second as { date?: string | number }).date ?? '';
    if (orderFirst < orderSecond) return 1;
    if (orderFirst > orderSecond) return -1;
    return 0;
  }
}
