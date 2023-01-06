import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataProperty } from '@home-budget/plans/models/plans.enum';

@Component({
  selector: 'hb-plan-project-details-form',
  templateUrl: './plan-details-form.component.html',
  styleUrls: ['./plan-details-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanDetailsFormComponent {
  public form: FormGroup;
  public monthLabel: string;
  public category: string;
  public dataLabels: any;

  constructor(
    public dialogRef: MatDialogRef<PlanDetailsFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { form: FormGroup; dataLabels: any; },
  ) {
    this.form = this.data.form;
    this.dataLabels = this.data.dataLabels;
  }

  private subscribeToColumnFormChanes(): void {
    this.entries.valueChanges
      .subscribe((item: any) => {
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
    this.dialogRef.close({ form: this.form });
  }

  public delete(): void {
    this.dialogRef.close({ form: this.form, isToDelete: true });
  }

  public get entries(): FormArray {
    return this.form.get(DataProperty.entries) as FormArray;
  }

  public get entryControl(): FormControl {
    return this.form.get('entry') as FormControl;
  }

  public get monthControl(): FormControl {
    return this.form.get(DataProperty.month) as FormControl;
  }

  private get totalControl(): FormControl {
    return this.form.get(DataProperty.total) as FormControl;
  }
}
