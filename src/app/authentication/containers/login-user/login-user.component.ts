import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonWithAnimationComponent } from '@shared/components';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as fromModels from '../../models';
import * as fromServices from '../../services';
import * as fromStoreServices from '../../store/services';


@Component({
  selector: 'hb-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.scss']
})
export class LoginUserComponent extends CommonWithAnimationComponent implements OnDestroy, OnInit {

  afterSuccessRouteUrl = './dashboard';
  loginForm: FormGroup;

  private subscription$ = new Subscription();

  constructor(
    private authenticationService: fromStoreServices.AuthenticationFacadeService,
    private authenticationUtilsService: fromServices.AuthenticationUtilsService,
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
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(this.authenticationUtilsService.emailPattern)]
      ],
      password: [null, [Validators.required]],
    });
  }

  loginUser(event: FormGroup) {
    const payload: fromModels.UserPayload = {
      key: null,
      value: event.value
    };

    this.authenticationService.loginUser(payload.value);
    this.subscription$.add(
      this.authenticationService.isSuccess$
        .pipe(
          tap(response => {
            if (response) {
              this.router.navigate([this.afterSuccessRouteUrl]);
            }
          }),
        ).subscribe()
    );
  }

}
