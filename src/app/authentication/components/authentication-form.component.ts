import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as fromServices from '../services';

@Component({
  selector: 'hb-authentication-form',
  template: '',
})
export class AuthenticationFormComponent {

  hide = true;

  @Input() form: FormGroup;
  @Output() onSubmitAction = new EventEmitter();

  constructor(
    private authenticationUtilsService: fromServices.AuthenticationUtilsService,
  ) { }

  get emailControl(): FormControl { return this.form.get('email') as FormControl; }
  get nameControl(): FormControl { return this.form.get('name') as FormControl; }
  get passwordControl(): FormControl { return this.form.get('password') as FormControl; }

  getErrorMessageForEmail() {
    return this.authenticationUtilsService.getErrorMessageForEmail(this.emailControl);
  }

  getErrorMessageForName() {
    return this.authenticationUtilsService.getErrorMessageForName(this.nameControl);
  }

  getErrorMessageForPassword() {
    return this.authenticationUtilsService.getErrorMessageForPassword(this.passwordControl);
  }

  onSubmit() {
    this.form.valid
      ? this.onSubmitAction.emit(this.form)
      : this.form.markAllAsTouched();
  }

}
