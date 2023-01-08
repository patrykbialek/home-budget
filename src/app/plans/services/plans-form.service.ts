import { Injectable } from '@angular/core';
import * as fromModels from '@home-budget/plans/models';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class PlansFormService {
  public buildEditForm(planEntry: fromModels.PlanEntry): FormGroup {
    const numberRegEx: RegExp = /^\d+([.,]\d{0,2})?$/;

    return new FormGroup({
      entry: new FormControl(planEntry.entry),
      hasEntries: new FormControl(planEntry.hasEntries, [Validators.required]),
      isInTotal: new FormControl(planEntry.isInTotal),
      label: new FormControl(planEntry.label, [Validators.required]),
      month: new FormControl(planEntry.month),
      notes: new FormControl(planEntry.notes),
      order: new FormControl(planEntry.order, [Validators.required]),
      path: new FormControl(planEntry.path.replace('month', planEntry.month)),
      total: new FormControl(planEntry.total, [Validators.required, Validators.pattern(numberRegEx)]),
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
