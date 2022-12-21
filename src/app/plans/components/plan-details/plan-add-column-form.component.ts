import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'hb-plan-add-column-details-form',
  templateUrl: './plan-add-column-form.component.html',
  styleUrls: ['./plan-add-column-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanAddColumnFormComponent {
  public form: FormGroup;
  public monthLabel: string;
  public category: string;
  public dataLabels: any;

  constructor(
    public dialogRef: MatDialogRef<PlanAddColumnFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { form: FormGroup; },
  ) {
    this.form = this.data.form;
  }

  public save(): void {
    this.dialogRef.close({ form: this.form });
  }

}
