import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import * as fromModels from '@budgets/models';

@Injectable({ providedIn: 'root' })
export class BugdetsFormService {
  public buildEditForm(entry: fromModels.PlanEntry): FormGroup {
    const numberRegEx: RegExp = /^\d+([.,]\d{0,2})?$/;

    return new FormGroup({
      entry: new FormControl(entry.entry),
      hasEntries: new FormControl(entry.hasEntries, [Validators.required]),
      isInTotal: new FormControl(entry.isInTotal),
      label: new FormControl(entry.label, [Validators.required]),
      month: new FormControl(entry.month),
      notes: new FormControl(entry.notes),
      order: new FormControl(entry.order, [Validators.required]),
      path: new FormControl(entry.path.replace('month', entry.month)),
      total: new FormControl(entry.total, [Validators.required, Validators.pattern(numberRegEx)]),
    });
  }

  public buildAddColumnForm(): FormGroup {
    return new FormGroup({
      hasEntries: new FormControl(null),
      label: new FormControl(null, [Validators.required]),
      order: new FormControl(0, [Validators.required]),
    });
  }
}
