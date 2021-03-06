import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as fromModels from '@home-budget/authentication/models';
import * as fromServices from '@home-budget/authentication/store/services';
import { CommonWithAnimationComponent } from '@home-budget/shared/components';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'hb-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss']
})
export class SetPasswordComponent extends CommonWithAnimationComponent implements OnInit {

  loginRouteUrl = '../login';
  code: string;
  setForm: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authenticationService: fromServices.AuthenticationFacadeService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    this.createForm();
    this.redirectToLoginIfNoCodeParam();
  }

  createForm() {
    this.setForm = this.formBuilder.group({
      password: [null, [
        Validators.required,
        Validators.minLength(6),
      ]],
    });
  }

  redirectToLoginIfNoCodeParam() {
    this.code = this.activatedRoute.snapshot.queryParams.oobCode;
    if (!this.code) {
      this.router.navigate([this.loginRouteUrl]);
    }
  }

  setPassword(event: FormGroup) {
    const payload: fromModels.PasswordSet = {
      newPassword: event.value.password,
      oobCode: this.code,
    };

    this.authenticationService.setPassword(payload);
    this.authenticationService.isSuccess$
      .pipe(
        tap(response => {
          if (response) {
            this.router.navigate([this.loginRouteUrl]);
          }
        }),
      ).subscribe();
  }
}
