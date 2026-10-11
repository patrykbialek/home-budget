import { FormGroup } from '@angular/forms';
import { Injectable, inject } from '@angular/core';

import { forkJoin, Observable } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

import { BreadcrumbsItem, DataLabel, FinanceEntry, UpdatePayload } from '@home-budget/finance/models';
import { FINANCE_FEATURE_CONFIG } from '@home-budget/finance/finance-feature.config';
import { FinanceHttpService } from './finance-http.service';
import { formatNumber, formPathForDeleteEntry } from './finance-details-former.utils';
import { months } from '../shared/finance.config';

@Injectable()
export class FinanceWriteService {
  private readonly financeHttpService = inject(FinanceHttpService);
  private readonly collection = inject(FINANCE_FEATURE_CONFIG).collection;

  deleteEntry(path: string, entry: FinanceEntry): Observable<unknown> {
    const updatedPath: string = formPathForDeleteEntry(path, entry);
    const subs$: Observable<unknown>[] = [];
    months.forEach((month: DataLabel) => {
      const replacedPath: string = updatedPath.replace('month', month.key);
      subs$.push(this.financeHttpService.deleteEntry(this.collection, replacedPath));
    });
    return forkJoin(subs$);
  }

  addColumn(form: FormGroup, currentEntries: BreadcrumbsItem): Observable<unknown> {
    let path: string = currentEntries.path ?? '';
    const entry: string = currentEntries.entry;
    const subs$: Observable<unknown>[] = [];

    let payload: Record<string, unknown> = {
      isInTotal: true,
      label: form.value.label,
      notes: null,
      order: form.value.order,
      total: 0,
    };

    months.forEach((month: DataLabel) => {
      path = path.replace(month.key, 'month');
    });

    months.forEach((month: DataLabel) => {
      const replacedPath = path.replace('month', month.key);
      subs$.push(this.financeHttpService.readEntriesObject(this.collection, replacedPath)
        .pipe(
          take(1),
          switchMap((raw) => {
            let entries = raw as Record<string, unknown>;
            const lastIndex: number = this.nextEntryIndex(entries, entry);
            const key: string = `${entry}${formatNumber(lastIndex)}`;

            if (form.value.hasEntries) {
              const childKey: string = `${key}${formatNumber(1)}`;
              payload = {
                ...payload,
                entries: {
                  [childKey]: {
                    isInTotal: true,
                    label: `${form.value.label} 1`,
                    order: 1,
                    total: 0,
                  }
                }
              };
            }

            entries = {
              ...entries,
              [key]: payload,
            };

            return this.financeHttpService.updateEntriesObject(this.collection, replacedPath, entries);
          }))
      );
    });

    return forkJoin(subs$);
  }

  updateEntry(payload: UpdatePayload, currentEntriesPath: string): Observable<unknown> {
    return this.financeHttpService.updateEntry(this.collection, payload)
      .pipe(
        take(1),
        tap(() => {
          this.updateParentTotals(payload.path);
          this.updateEntryLabelToAllMonths(payload, currentEntriesPath);
        })
      );
  }

  private nextEntryIndex(entries: Record<string, unknown>, entry: string): number {
    const indices: number[] = Object.keys(entries)
      .filter((key: string) => key.startsWith(entry))
      .map((key: string) => Number(key.slice(entry.length)))
      .filter((index: number) => Number.isInteger(index));
    return (indices.length ? Math.max(...indices) : 0) + 1;
  }

  private updateEntryLabelToAllMonths(payload: UpdatePayload, currentEntriesPath: string): void {
    const entry: string = payload.entry;
    const label: string = payload.label ?? '';

    let path: string = currentEntriesPath;
    months.forEach((month: DataLabel) => {
      path = path.replace(month.key, 'month');
    });

    months.forEach((month: DataLabel) => {
      const replacedPath: string = path.replace('month', month.key);
      this.updateEntryLabel({ entry, label, path: replacedPath });
    });
  }

  private updateEntryLabel(payload: UpdatePayload): void {
    this.financeHttpService.updateEntryLabel(this.collection, payload)
      .pipe(take(1))
      .subscribe();
  }

  private updateParentTotals(path: string): void {
    let newPath: string[] = path.split('/');
    const len: number = ((newPath.length - 6));
    const subs$ = [];
    for (let i = 0; i < len; i++) {
      newPath = newPath.slice(0, -1);

      if (newPath[newPath.length - 1] !== 'entries') {
        const formedPath = newPath.join('/').split('/').slice(0, -1).join('/');
        subs$.push(
          this.financeHttpService.readDataByTypeObject(this.collection, newPath.join('/'))
            .pipe(
              take(len / 2),
              tap((response) => {
                const item = response as { key: string | null; value: { entries?: Record<string, { isInTotal: boolean; total: number }> } };
                if (item.key !== 'entries') {
                  let total: number = 0;
                  const entries = item.value?.entries ?? {};
                  Object.keys(entries)
                    .forEach((entryKey: string) => {
                      if (entries[entryKey].isInTotal) {
                        total += entries[entryKey].total;
                      }
                    });

                  const updatePayload: UpdatePayload = {
                    path: formedPath,
                    entry: item.key ?? '',
                    total: parseFloat(total.toFixed(2)),
                  };
                  this.updateParentEntry(updatePayload);
                }
              })
            )
        );
      }
    }
    forkJoin(subs$)
      .subscribe();
  }

  private updateParentEntry(payload: UpdatePayload): void {
    this.financeHttpService.updateParentEntry(this.collection, payload)
      .pipe(take(1))
      .subscribe();
  }
}
