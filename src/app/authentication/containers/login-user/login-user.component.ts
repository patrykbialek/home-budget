import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take, tap } from 'rxjs/operators';

import { CommonWithAnimationComponent } from '@shared/components';
import * as fromModels from '../../models';
import * as fromServices from '../../store/services';

@Component({
  selector: 'hb-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.scss']
})
export class LoginUserComponent extends CommonWithAnimationComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private authenticationService: fromServices.AuthenticationFacadeService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      password: [null, [Validators.required]],
    });
  }

  loginUser(event: FormGroup) {
    const payload: fromModels.UserPayload = {
      key: null,
      value: event.value
    };

    this.authenticationService.loginUser(payload.value);

    this.authenticationService.isSuccess$
      .pipe(
        take(1),
        tap(response => {
          if (response) {
            this.router.navigate(['./dashboard']);
          }
        }),
      ).subscribe();
  }

}
