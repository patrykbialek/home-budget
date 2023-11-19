import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'hb-budget-add-column-details-form',
  templateUrl: './budget-add-column-form.component.html',
  styleUrls: ['./budget-add-column-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetAddColumnFormComponent {
  public category: string;
  public dataLabels: any;
  public form: FormGroup;
  public monthLabel: string;

  constructor(
    public dialogRef: MatDialogRef<BudgetAddColumnFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { form: FormGroup; },
  ) {
    this.form = this.data.form;
  }

  public save(): void {
    this.dialogRef.close({ form: this.form });
  }

}
