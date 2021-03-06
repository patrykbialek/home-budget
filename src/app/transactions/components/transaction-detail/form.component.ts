import {
  AfterViewInit, ChangeDetectionStrategy, Component,
  ElementRef, EventEmitter, Input, Output, ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'hb-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent implements AfterViewInit {

  @Input() categories$: Observable<any[]>;
  @Input() mode: string;
  @Input() transactionForm: FormGroup;
  @Output() deleteItem = new EventEmitter();
  @Output() saveData = new EventEmitter();

  @ViewChild('amountHTML') amountHTML: ElementRef;

  constructor() { }

  get amountControl() { return this.transactionForm.get('amount'); }
  get categoryControl() { return this.transactionForm.get('category'); }
  get dateControl() { return this.transactionForm.get('date'); }
  get recipientControl() { return this.transactionForm.get('recipient'); }
  get typeControl() { return this.transactionForm.get('type'); }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.amountHTML.nativeElement.focus();
    });
  }

  getErrorMessage() {
    if (this.amountControl.hasError('required')
      || this.categoryControl.hasError('required')
      || this.dateControl.hasError('required')
      || this.recipientControl.hasError('required')) {
      return 'TRANSACTION.ValidationMessages.Required';
    }
  }

  onDelete() {
    this.deleteItem.emit();
  }

  onSave() {
    if (this.transactionForm.valid) {
      this.saveData.emit(this.transactionForm);
    } else {
      this.transactionForm.markAllAsTouched();
    }
  }
}
