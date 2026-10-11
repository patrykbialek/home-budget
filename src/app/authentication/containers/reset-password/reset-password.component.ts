import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordReset } from '@home-budget/authentication/models';
import * as fromServices from '@home-budget/authentication/services';
import * as fromStoreServices from '@home-budget/authentication/store/services';
import { CommonWithAnimationComponent } from '@home-budget/shared/components';
import { filter, skip, take, tap } from 'rxjs/operators';
import { CommonWithAnimationComponent as CommonWithAnimationComponent_1 } from '../../../shared/components/common-with-animation.component';
import { ResetFormComponent } from '../../components/reset-password/reset-form.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'hb-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
    imports: [CommonWithAnimationComponent_1, ResetFormComponent, TranslatePipe]
})
export class ResetPasswordComponent extends CommonWithAnimationComponent implements OnInit {

  private authenticationService = inject(fromStoreServices.AuthenticationFacadeService);
  private authenticationUtilsService = inject(fromServices.AuthenticationUtilsService);
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
