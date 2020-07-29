import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as fromServices from '../../services';

@Component({
  selector: 'hb-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  hide = true;

  @Input() loginForm: FormGroup;
  @Output() loginUser = new EventEmitter();

  constructor(
    private authenticationUtilsService: fromServices.AuthenticationUtilsService,
  ) { }

  get emailControl(): FormControl { return this.loginForm.get('email') as FormControl; }
  get passwordControl(): FormControl { return this.loginForm.get('password') as FormControl; }

  ngOnInit(): void {
  }

  getErrorMessageForEmail() {
    return this.authenticationUtilsService.getErrorMessageForEmail(this.emailControl)
  }

  getErrorMessageForPassword() {
    return this.authenticationUtilsService.getErrorMessageForPassword(this.passwordControl)
  }

  onLogin() {
    this.loginForm.valid
      ? this.loginUser.emit(this.loginForm)
      : this.loginForm.markAllAsTouched();
  }

}
