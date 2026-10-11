import { trigger, transition, style, animate } from '@angular/animations';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import * as fromModels from '@home-budget/finance/models';
import { DataProperty } from '@home-budget/finance/models/finance.enum';
import { MatIcon } from '@angular/material/icon';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatSuffix, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatButton } from '@angular/material/button';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'hb-finance-edit-form',
  templateUrl: './finance-edit-form.component.html',
  styleUrls: ['./finance-edit-form.component.scss'],
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
  imports: [MatDialogTitle, MatIcon, ReactiveFormsModule, CdkScrollable, MatDialogContent, MatFormField, MatLabel, MatInput, MatSuffix, MatError, MatSlideToggle, MatDialogActions, MatButton, MatDialogClose, TitleCasePipe]
})
export class FinanceEditFormComponent {
  dialogRef = inject(MatDialogRef<FinanceEditFormComponent>);
  data: { form: FormGroup; dataLabels: fromModels.DataLabels; } = inject(MAT_DIALOG_DATA);

  category: string | undefined;
  dataLabels: fromModels.DataLabels = this.data.dataLabels;
  form: FormGroup = this.data.form;
  isDeleteButtonShown = false;
  isMoreShown: boolean = false;
  monthLabel: string | undefined;

  getEntries(control: string): FormArray {
    return this.form.get(control)?.get('entries') as FormArray;
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
