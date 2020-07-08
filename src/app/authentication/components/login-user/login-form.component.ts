import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'hb-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  @Input() loginForm: FormGroup;
  @Output() loginUser = new EventEmitter();

  @ViewChild('nameHTML') nameHTML: ElementRef;

  constructor() { }

  get emailControl() { return this.loginForm.get('email'); }
  get passwordControl() { return this.loginForm.get('password'); }

  ngOnInit(): void {
    setTimeout(() => {
      this.nameHTML.nativeElement.focus();
    });
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
    if (this.loginForm.valid) {
      this.loginUser.emit(this.loginForm)
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

}
