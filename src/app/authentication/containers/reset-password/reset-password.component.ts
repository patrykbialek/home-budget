import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { filter, skip, take, tap } from 'rxjs/operators';
import { TranslatePipe } from '@ngx-translate/core';

import { AuthenticationFacadeService } from '@home-budget/authentication/store/services';
import { AuthenticationUtilsService } from '@home-budget/authentication/services';
import { CommonWithAnimationComponent } from '@home-budget/shared/components';
import { PasswordReset } from '@home-budget/authentication/models';
import { ResetFormComponent } from '../../components/reset-password/reset-form.component';

@Component({
  selector: 'hb-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  imports: [CommonWithAnimationComponent, ResetFormComponent, TranslatePipe]
})
export class ResetPasswordComponent extends CommonWithAnimationComponent implements OnInit {

  private authenticationService = inject(AuthenticationFacadeService);
  private authenticationUtilsService = inject(AuthenticationUtilsService);
  private formBuilder = inject(FormBuilder);

  resetForm!: FormGroup;

  get emailControl() { return this.resetForm.get('email'); }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.resetForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(this.authenticationUtilsService.emailPattern)
      ]],
    });
  }

  resetPassword(event: FormGroup) {
    const payload: PasswordReset = {
      email: event.value.email
    };

    this.authenticationService.resetPassword(payload);
    this.authenticationService.isSuccess$
      .pipe(
        skip(1),
        filter(Boolean),
        take(1),
        tap(() => this.emailControl?.setValue('', { emitEvent: false })),
      ).subscribe();
  }

}
