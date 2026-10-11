import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { filter, skip, take, tap } from 'rxjs/operators';
import { TranslatePipe } from '@ngx-translate/core';

import { AuthenticationFacadeService } from '@home-budget/authentication/store/services';
import { CommonWithAnimationComponent } from '@home-budget/shared/components';
import { PasswordSet } from '@home-budget/authentication/models';
import { SetFormComponent } from '../../components/set-password/set-form.component';

@Component({
  selector: 'hb-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss'],
  imports: [CommonWithAnimationComponent, SetFormComponent, TranslatePipe]
})
export class SetPasswordComponent extends CommonWithAnimationComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private authenticationService = inject(AuthenticationFacadeService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  loginRouteUrl = '../login';
  code: string | undefined;
  setForm!: FormGroup;

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
    const payload: PasswordSet = {
      newPassword: event.value.password,
      oobCode: this.code ?? '',
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
