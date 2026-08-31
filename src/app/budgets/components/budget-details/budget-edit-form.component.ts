import { trigger, transition, style, animate } from '@angular/animations';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as fromModels from '@budgets/models';

import { DataProperty } from '@budgets/models/plans.enum';

@Component({
  selector: 'hb-budget-edit-form',
  templateUrl: './budget-edit-form.component.html',
  styleUrls: ['./budget-edit-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({ height: '0', opacity: 0 }),
        animate('350ms', style({ height: '264px', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ height: '264px', opacity: 1 }),
        animate('350ms', style({ height: '0', opacity: 0 }))
      ])
    ])
  ],
  standalone: false
})
export class BudgetEditFormComponent {
  dialogRef = inject(MatDialogRef<BudgetEditFormComponent>);
  data: { form: FormGroup; dataLabels: fromModels.DataLabels; } = inject(MAT_DIALOG_DATA);

  category: string | undefined;
  dataLabels: fromModels.DataLabels = this.data.dataLabels;
  form: FormGroup = this.data.form;
  isDeleteButtonShown = false;
  isMoreShown: boolean = false;
  monthLabel: string | undefined;

  getEntries(control: string): FormArray {
    return this.form.get(control).get('entries') as FormArray;
  }

  save(): void {
    this.dialogRef.close({ form: this.form });
  }

  delete(): void {
    this.dialogRef.close({ form: this.form, isToDelete: true });
  }

  get entries(): FormArray {
    return this.form.get(DataProperty.entries) as FormArray;
  }

  get entryControl(): FormControl {
    return this.form.get('entry') as FormControl;
  }

  get monthControl(): FormControl {
    return this.form.get(DataProperty.month) as FormControl;
  }

  toggleIsDeleteButtonShown(): void {
    this.isDeleteButtonShown = !this.isDeleteButtonShown;
  }

  toggleIsMoreShown(): void {
    this.isMoreShown = !this.isMoreShown;
  }
}
