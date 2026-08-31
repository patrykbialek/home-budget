import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as fromModels from '@home-budget/plans/models';

@Component({
  selector: 'hb-plan-add-column-details-form',
  templateUrl: './plan-add-column-form.component.html',
  styleUrls: ['./plan-add-column-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PlanAddColumnFormComponent {
  dialogRef = inject(MatDialogRef<PlanAddColumnFormComponent>);
  data: { form: FormGroup; } = inject(MAT_DIALOG_DATA);

  category: string | undefined;
  dataLabels: fromModels.DataLabels | undefined;
  form: FormGroup = this.data.form;
  monthLabel: string | undefined;

  save(): void {
    this.dialogRef.close({ form: this.form });
  }

}
