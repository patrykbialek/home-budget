import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { CommonWithAnimationComponent } from '@shared/components';
import * as fromModels from '../../models';
import * as fromServices from '../../store/services';

@Component({
  selector: 'hb-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.scss']
})
export class LoginUserComponent extends CommonWithAnimationComponent implements OnDestroy, OnInit {

  loginForm: FormGroup;

  private subscription$ = new Subscription();

  constructor(
    private authenticationService: fromServices.AuthenticationFacadeService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    super();
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });
  }

  loginUser(event: FormGroup) {
    const payload: fromModels.UserPayload = {
      key: null,
      value: event.value
    };

    this.authenticationService.loginUser(payload.value);
    this.subscription$.add(this.authenticationService.isSuccess$
      .pipe(
        tap(response => {
          if (response) {
            this.router.navigate(['./dashboard']);
          }
        }),
      ).subscribe()
    );
  }

}
