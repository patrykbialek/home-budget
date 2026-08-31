import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as fromModels from '@home-budget/authentication/models';
import * as fromServices from '@home-budget/authentication/store/services';
import { CommonWithAnimationComponent } from '@home-budget/shared/components';
import { filter, skip, take, tap } from 'rxjs/operators';

@Component({
    selector: 'hb-set-password',
    templateUrl: './set-password.component.html',
    styleUrls: ['./set-password.component.scss'],
    standalone: false
})
export class SetPasswordComponent extends CommonWithAnimationComponent implements OnInit {

  private activatedRoute = inject(ActivatedRoute);
  private authenticationService = inject(fromServices.AuthenticationFacadeService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  loginRouteUrl = '../login';
  code: string | undefined;
  setForm: FormGroup;

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
        skip(1),
        filter(Boolean),
        take(1),
        tap(() => this.router.navigate([this.loginRouteUrl])),
      ).subscribe();
  }
}
