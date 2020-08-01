import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonWithAnimationComponent } from '@shared/components';
import { tap } from 'rxjs/operators';
import * as fromModels from '../../models';
import * as fromServices from '../../services';
import * as fromStoreServices from '../../store/services';

@Component({
  selector: 'hb-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent extends CommonWithAnimationComponent implements OnInit {

  afterSuccessRouteUrl = './dashboard';
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
    const payload: fromModels.UserPayload = {
      key: null,
      value: event.value
    };

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
