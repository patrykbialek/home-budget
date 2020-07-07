import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'hb-register-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  @Input() registerForm: FormGroup;
  @Output() registerUser = new EventEmitter();

  @ViewChild('nameHTML') nameHTML: ElementRef;

  constructor() { }

  get nameControl() { return this.registerForm.get('name'); }
  get emailControl() { return this.registerForm.get('email'); }
  get passwordControl() { return this.registerForm.get('password'); }

  ngOnInit(): void {
    setTimeout(() => {
      this.nameHTML.nativeElement.focus();
    });
  }

  getErrorMessageForName() {
    if (this.nameControl.hasError('required')) {
      return 'Pole wymagane.';
    }
  }

  getErrorMessageForEmail() {
    if (this.passwordControl.hasError('required')) {
      return 'Pole wymagane.';
    }

    if (this.emailControl.hasError('pattern')) {
      return 'Nieprawidłowy format adresu e-mail.';
    }
  }

  getErrorMessageForPassword() {
    if (this.emailControl.hasError('required')) {
      return 'Pole wymagane.';
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      this.registerUser.emit(this.registerForm)
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

}
