import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import * as fromModels from '@home-budget/finance/models';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'hb-finance-add-column-details-form',
  templateUrl: './finance-add-column-form.component.html',
  styleUrls: ['./finance-add-column-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogTitle, ReactiveFormsModule, CdkScrollable, MatDialogContent, MatFormField, MatLabel, MatInput, MatError, MatCheckbox, MatDialogActions, MatButton, MatDialogClose, TitleCasePipe]
})
export class FinanceAddColumnFormComponent {
  dialogRef = inject(MatDialogRef<FinanceAddColumnFormComponent>);
  data: { form: FormGroup; } = inject(MAT_DIALOG_DATA);

  category: string | undefined;
  dataLabels: fromModels.DataLabels | undefined;
  form: FormGroup = this.data.form;
  monthLabel: string | undefined;

  save(): void {
    this.dialogRef.close({ form: this.form });
  }

}
