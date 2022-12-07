
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { data } from '../../plan-project.data';

@Component({
  selector: 'hb-plan-project-details-form',
  templateUrl: './plan-project-details-form.component.html',
  styleUrls: ['./plan-project-details-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanProjectDetailsFormComponent implements OnInit {

  @Input() public form: FormGroup;
  @Input() public monthId: string;
  @Input() public columns: string[] = [];

  public ngOnInit(): void {
    //
  }

  public getEntries(control: string): FormArray {
    return this.form.get(control).get('entries') as FormArray;
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }
    const currentStorage = JSON.parse(localStorage.getItem('plan'));
    const value = this.form.value;
    const data = {
      ...currentStorage,
      '2023': {
        project: {
          ...currentStorage['2023'].project,
          [this.monthId]: {
            ...currentStorage['2023'].project[this.monthId],
            incomes: value,
          },
        }
      }
    };
    localStorage.setItem('plan', JSON.stringify(data));
  }
}
