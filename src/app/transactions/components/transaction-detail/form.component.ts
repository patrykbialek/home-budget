import { Component, OnInit, EventEmitter, Output, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'hb-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent implements OnInit {

  @Input() categories$: Observable<any[]>;
  @Input() transactionForm: FormGroup;
  @Output() saveData = new EventEmitter();

  constructor() { }

  get amountControl() { return this.transactionForm.get('amount'); }
  get categoryControl() { return this.transactionForm.get('category'); }
  get dateControl() { return this.transactionForm.get('date'); }
  get recipientControl() { return this.transactionForm.get('recipient'); }
  get typeControl() { return this.transactionForm.get('type'); }

  ngOnInit(): void {
  }

  getErrorMessage() {
    if (this.amountControl.hasError('required')
      || this.categoryControl.hasError('required')
      || this.dateControl.hasError('required')
      || this.recipientControl.hasError('required')) {
      return 'Pole wymagane.';
    }
  }

  onSave() {
    if (this.transactionForm.valid) {
      this.saveData.emit(this.transactionForm)
    } else {
      this.transactionForm.markAllAsTouched();
    }
  }
}
