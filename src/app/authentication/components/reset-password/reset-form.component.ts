import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'hb-reset-form',
  templateUrl: './reset-form.component.html',
  styleUrls: ['./reset-form.component.scss']
})
export class ResetFormComponent implements OnInit {

  @Input() resetForm: FormGroup;
  @Output() resetPassword = new EventEmitter();

  @ViewChild('emailHTML') emailHTML: ElementRef;

  constructor() { }

  get emailControl() { return this.resetForm.get('email'); }

  ngOnInit(): void {
    setTimeout(() => {
      this.emailHTML.nativeElement.focus();
    }, 100);
  }

  getErrorMessageForEmail() {
    if (this.emailControl.hasError('required')) {
      return 'Pole wymagane.';
    }

    if (this.emailControl.hasError('email')) {
      return 'Nieprawidłowy format adresu e-mail.';
    }
  }

  onReset() {
    if (this.resetForm.valid) {
      this.resetPassword.emit(this.resetForm)
    } else {
      this.resetForm.markAllAsTouched();
    }
  }

}
