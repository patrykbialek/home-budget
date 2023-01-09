import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fromModels from '@home-budget/authentication/models';
import * as fromServices from '@home-budget/authentication/services';
import * as fromStoreServices from '@home-budget/authentication/store/services';
import { CommonWithAnimationComponent } from '@home-budget/shared/components';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'hb-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent extends CommonWithAnimationComponent implements OnInit {

  afterSuccessRouteUrl = './plans';
  registerForm: FormGroup;

  constructor(
    private authenticationService: fromStoreServices.AuthenticationFacadeService,
    private authenticationUtilsService: fromServices.AuthenticationUtilsService,
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
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(this.authenticationUtilsService.emailPattern)
      ]],
      password: [null, [
        Validators.required,
        Validators.minLength(6),
      ]],
    });
  }

  registerUser(event: FormGroup) {
    const payload: fromModels.UserRegister = event.value;

    this.authenticationService.registerUser(payload);
    this.authenticationService.isSuccess$
      .pipe(
        tap(response => {
          if (response) {
            this.router.navigate([this.afterSuccessRouteUrl]);
          }
        }),
      ).subscribe();
  }

}
