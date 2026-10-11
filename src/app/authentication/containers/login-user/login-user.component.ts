import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserLogin } from '@home-budget/authentication/models';
import * as fromServices from '@home-budget/authentication/services';
import * as fromStoreServices from '@home-budget/authentication/store/services';
import { CommonWithAnimationComponent } from '@home-budget/shared/components';
import { Subject } from 'rxjs';
import { filter, skip, takeUntil, tap } from 'rxjs/operators';
import { CommonWithAnimationComponent as CommonWithAnimationComponent_1 } from '../../../shared/components/common-with-animation.component';
import { LoginFormComponent } from '../../components/login-user/login-form.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'hb-login-user',
    templateUrl: './login-user.component.html',
    styleUrls: ['./login-user.component.scss'],
    imports: [CommonWithAnimationComponent_1, LoginFormComponent, TranslatePipe]
})
export class LoginUserComponent extends CommonWithAnimationComponent implements OnDestroy, OnInit {

  private readonly authenticationService = inject(fromStoreServices.AuthenticationFacadeService);
  private readonly authenticationUtilsService = inject(fromServices.AuthenticationUtilsService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  loginForm: FormGroup;

  private readonly destroy$ = new Subject<void>();

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.createForm();
    this.authenticationService.isSuccess$
      .pipe(
        skip(1),
        filter(Boolean),
        tap(() => this.router.navigate(['/', new Date().getFullYear().toString(), 'plans'])),
        takeUntil(this.destroy$),
      )
      .subscribe();
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
    const payload: UserLogin = event.value;
    this.authenticationService.loginUser(payload);
  }
}
