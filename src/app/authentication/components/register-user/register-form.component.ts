import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as fromServices from '../../services';

@Component({
  selector: 'hb-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent implements OnInit {

  hide = true;

  @Input() errorMessage: string;
  @Input() registerForm: FormGroup;
  @Output() registerUser = new EventEmitter();

  @ViewChild('nameHTML') nameHTML: ElementRef;

  constructor(
    private authenticationUtilsService: fromServices.AuthenticationUtilsService,
  ) { }

  get nameControl(): FormControl { return this.registerForm.get('name') as FormControl; }
  get emailControl(): FormControl { return this.registerForm.get('email') as FormControl; }
  get passwordControl(): FormControl { return this.registerForm.get('password') as FormControl; }

  ngOnInit(): void {
    setTimeout(() => {
      this.nameHTML.nativeElement.focus();
    });
  }

  getErrorMessageForName() {
    return this.authenticationUtilsService.getErrorMessageForName(this.nameControl);
  }

  getErrorMessageForEmail() {
    return this.authenticationUtilsService.getErrorMessageForEmail(this.emailControl);
  }

  getErrorMessageForPassword() {
    return this.authenticationUtilsService.getErrorMessageForPassword(this.passwordControl);
  }

  onRegister() {
    this.registerForm.valid
      ? this.registerUser.emit(this.registerForm)
      : this.registerForm.markAllAsTouched();
  }

}
