import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as fromModels from '@budgets/models';

@Component({
  selector: 'hb-budget-add-column-details-form',
  templateUrl: './budget-add-column-form.component.html',
  styleUrls: ['./budget-add-column-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class BudgetAddColumnFormComponent {
  dialogRef = inject(MatDialogRef<BudgetAddColumnFormComponent>);
  data: { form: FormGroup; } = inject(MAT_DIALOG_DATA);

  category: string | undefined;
  dataLabels: fromModels.DataLabels | undefined;
  form: FormGroup = this.data.form;
  monthLabel: string | undefined;

  save(): void {
    this.dialogRef.close({ form: this.form });
  }

}
