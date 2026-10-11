import { Injectable } from '@angular/core';
import { FinanceEntry } from '@home-budget/finance/models';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable()
export class FinanceFormService {
  buildEditForm(financeEntry: FinanceEntry): FormGroup {
    const numberRegEx: RegExp = /^\d+([.,]\d{0,2})?$/;

    return new FormGroup({
      entry: new FormControl(financeEntry.entry),
      hasEntries: new FormControl(financeEntry.hasEntries, [Validators.required]),
      isInTotal: new FormControl(financeEntry.isInTotal),
      label: new FormControl(financeEntry.label, [Validators.required]),
      month: new FormControl(financeEntry.month),
      notes: new FormControl(financeEntry.notes),
      order: new FormControl(financeEntry.order, [Validators.required]),
      path: new FormControl((financeEntry.path ?? '').replace('month', financeEntry.month ?? '')),
      total: new FormControl(financeEntry.total, [Validators.required, Validators.pattern(numberRegEx)]),
    });
  }

  buildAddColumnForm(): FormGroup {
    return new FormGroup({
      hasEntries: new FormControl(null),
      label: new FormControl(null, [Validators.required]),
      order: new FormControl(0, [Validators.required]),
    });
  }
}
