import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fromModels from '@home-budget/authentication/models';
import * as fromServices from '@home-budget/authentication/services';
import * as fromStoreServices from '@home-budget/authentication/store/services';
import { CommonWithAnimationComponent } from '@home-budget/shared/components';
import { filter, skip, take, tap } from 'rxjs/operators';

@Component({
    selector: 'hb-register-user',
    templateUrl: './register-user.component.html',
    styleUrls: ['./register-user.component.scss'],
    standalone: false
})
export class RegisterUserComponent extends CommonWithAnimationComponent implements OnInit {

  private authenticationService = inject(fromStoreServices.AuthenticationFacadeService);
  private authenticationUtilsService = inject(fromServices.AuthenticationUtilsService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  afterSuccessRouteUrl = './plans';
  registerForm: FormGroup;

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
        skip(1),
        filter(Boolean),
        take(1),
        tap(() => this.router.navigate([this.afterSuccessRouteUrl])),
      ).subscribe();
  }

}
