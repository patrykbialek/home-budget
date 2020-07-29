import { Component, } from '@angular/core';
import * as fromServices from '../../services';
import { AuthenticationFormComponent } from '../authentication-form.component';

@Component({
  selector: 'hb-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent extends AuthenticationFormComponent {

  constructor(
    authenticationUtilsService: fromServices.AuthenticationUtilsService,
  ) { super(authenticationUtilsService) }

}
