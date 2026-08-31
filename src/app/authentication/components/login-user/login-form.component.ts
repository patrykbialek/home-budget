import { Component } from '@angular/core';
import { AuthenticationFormComponent } from '@home-budget/authentication/components/authentication-form.component';

@Component({
    selector: 'hb-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.scss'],
    standalone: false
})
export class LoginFormComponent extends AuthenticationFormComponent {

}
