import { Component, } from '@angular/core';
import * as fromServices from '@home-budget/authentication/services';
import { AuthenticationFormComponent } from '@home-budget/authentication/components/authentication-form.component';

@Component({
  selector: 'hb-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent extends AuthenticationFormComponent {

  constructor(
    authenticationUtilsService: fromServices.AuthenticationUtilsService,
  ) { super(authenticationUtilsService); }

}
