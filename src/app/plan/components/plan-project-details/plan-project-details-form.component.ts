import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataProperty } from '@home-budget/plan/plan.enum';

@Component({
  selector: 'hb-plan-project-details-form',
  templateUrl: './plan-project-details-form.component.html',
  styleUrls: ['./plan-project-details-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanProjectDetailsFormComponent {

  public form: FormGroup;
  public monthLabel: string;
  public category: string;

  constructor(
    public dialogRef: MatDialogRef<PlanProjectDetailsFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { form: FormGroup; monthLabel: string, category: string; },
  ) {
    this.form = this.data.form;
    this.monthLabel = this.data.monthLabel;
    this.category = this.data.category;
    this.subscribeToColumnFormChanes();
  }

  private subscribeToColumnFormChanes(): void {
    this.entries.valueChanges
      .subscribe((item: any) => {
        console.log(item)
        let total: number = 0;
        item.forEach((entry: any) => {
          if (entry.isInTotal) {
            total += parseFloat(entry.value || 0);
          }
        });

        this.totalControl.setValue(total);
      });
  }

  public getEntries(control: string): FormArray {
    return this.form.get(control).get('entries') as FormArray;
  }

  public save(): void {
    this.dialogRef.close({ category: this.category, form: this.form });
  }

  public get entries(): FormArray {
    return this.form.get(DataProperty.entries) as FormArray;
  }

  private get totalControl(): FormControl {
    return this.form.get(DataProperty.total) as FormControl;
  }
}
