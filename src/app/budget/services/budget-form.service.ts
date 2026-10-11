import { Injectable } from '@angular/core';
import * as fromModels from '@home-budget/budget/models';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable()
export class BudgetFormService {
  buildEditForm(budgetEntry: fromModels.BudgetEntry): FormGroup {
    const numberRegEx: RegExp = /^\d+([.,]\d{0,2})?$/;

    return new FormGroup({
      entry: new FormControl(budgetEntry.entry),
      hasEntries: new FormControl(budgetEntry.hasEntries, [Validators.required]),
      isInTotal: new FormControl(budgetEntry.isInTotal),
      label: new FormControl(budgetEntry.label, [Validators.required]),
      month: new FormControl(budgetEntry.month),
      notes: new FormControl(budgetEntry.notes),
      order: new FormControl(budgetEntry.order, [Validators.required]),
      path: new FormControl((budgetEntry.path ?? '').replace('month', budgetEntry.month ?? '')),
      total: new FormControl(budgetEntry.total, [Validators.required, Validators.pattern(numberRegEx)]),
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
