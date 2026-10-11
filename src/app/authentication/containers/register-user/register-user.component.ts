import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { filter, skip, take, tap } from 'rxjs/operators';
import { TranslatePipe } from '@ngx-translate/core';

import { AuthenticationFacadeService } from '@home-budget/authentication/store/services';
import { AuthenticationUtilsService } from '@home-budget/authentication/services';
import { CommonWithAnimationComponent } from '@home-budget/shared/components';
import { RegisterFormComponent } from '../../components/register-user/register-form.component';
import { UserRegister } from '@home-budget/authentication/models';

@Component({
  selector: 'hb-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss'],
  imports: [CommonWithAnimationComponent, RegisterFormComponent, TranslatePipe]
})
export class RegisterUserComponent extends CommonWithAnimationComponent implements OnInit {
  private authenticationService = inject(AuthenticationFacadeService);
  private authenticationUtilsService = inject(AuthenticationUtilsService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  registerForm!: FormGroup;

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
    const payload: UserRegister = event.value;

    this.authenticationService.registerUser(payload);
    this.authenticationService.isSuccess$
      .pipe(
        skip(1),
        filter(Boolean),
        take(1),
        tap(() => this.router.navigate(['/', new Date().getFullYear().toString(), 'plans'])),
      ).subscribe();
  }

}
