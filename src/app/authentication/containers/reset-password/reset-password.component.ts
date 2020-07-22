import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap, take } from 'rxjs/operators';

import { CommonWithAnimationComponent } from '@shared/components';
import * as fromModels from '../../models';
import * as fromServices from '../../store/services';

@Component({
  selector: 'hb-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent extends CommonWithAnimationComponent implements OnInit {

  resetForm: FormGroup;

  constructor(
    private authenticationService: fromServices.AuthenticationFacadeService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    super();
  }

  get emailControl() { return this.resetForm.get('email'); }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.resetForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
    });
  }

  resetPassword(event: FormGroup) {
    const payload: fromModels.UserPayload = {
      key: null,
      value: event.value
    };

    this.authenticationService.resetPassword(payload)
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
