import { Component, OnInit } from '@angular/core';
import { CommonWithAnimationComponent } from '@shared/components';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import * as fromModels from '../../models';
import * as fromServices from '../../store/services';
import { take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'hb-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent extends CommonWithAnimationComponent implements OnInit {

  registerForm: FormGroup;

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
    this.registerForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      password: [null, [Validators.required]],
    });
  }

  registerUser(event: FormGroup) {
    const payload: fromModels.UserPayload = {
      key: null,
      value: event.value
    };

    this.authenticationService.registerUser(payload);

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
