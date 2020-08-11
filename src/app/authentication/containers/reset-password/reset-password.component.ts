import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as fromModels from '@home-budget/authentication/models';
import * as fromServices from '@home-budget/authentication/services';
import * as fromStoreServices from '@home-budget/authentication/store/services';
import { CommonWithAnimationComponent } from '@home-budget/shared/components';
import { take, tap } from 'rxjs/operators';

@Component({
  selector: 'hb-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent extends CommonWithAnimationComponent implements OnInit {

  resetForm: FormGroup;

  constructor(
    private authenticationService: fromStoreServices.AuthenticationFacadeService,
    private authenticationUtilsService: fromServices.AuthenticationUtilsService,
    private formBuilder: FormBuilder,
  ) {
    super();
  }

  get emailControl() { return this.resetForm.get('email'); }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.resetForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(this.authenticationUtilsService.emailPattern)
      ]],
    });
  }

  resetPassword(event: FormGroup) {
    const payload: fromModels.PasswordReset = {
      email: event.value.email
    };

    this.authenticationService.resetPassword(payload);
    this.authenticationService.isSuccess$
      .pipe(
        take(1),
        tap(response => {
          if (response) {
            this.emailControl.setValue('', { emitEvent: false });
          }
        }),
      ).subscribe();
  }

}
