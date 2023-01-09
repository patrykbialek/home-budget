import { trigger, transition, style, animate } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataProperty } from '@home-budget/plans/models/plans.enum';

@Component({
  selector: 'hb-plan-edit-form',
  templateUrl: './plan-edit-form.component.html',
  styleUrls: ['./plan-edit-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger(
      'enterAnimation', [
      transition(':enter', [
        style({ height: '0', opacity: 0 }),
        animate('350ms', style({ height: '264px', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ height: '264px', opacity: 1 }),
        animate('350ms', style({ height: '0', opacity: 0 }))
      ])
    ]
    )
  ],
})
export class PlanEditFormComponent {
  public category: string;
  public dataLabels: any;
  public form: FormGroup;
  public isDeleteButtonShown: boolean;
  public isMoreShown: boolean = false;
  public monthLabel: string;

  constructor(
    public dialogRef: MatDialogRef<PlanEditFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { form: FormGroup; dataLabels: any; },
  ) {
    this.form = this.data.form;
    this.dataLabels = this.data.dataLabels;
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

  public toggleIsDeleteButtonShown(): void {
    this.isDeleteButtonShown = !this.isDeleteButtonShown;
  }

  public toggleIsMoreShown(): void {
    this.isMoreShown = !this.isMoreShown;
  }
}
