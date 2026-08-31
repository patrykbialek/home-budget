import { Component, OnInit, inject } from '@angular/core';
import { AuthenticationFacadeService } from '@home-budget/authentication/store';

@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.scss'],
    standalone: false
})
export class AuthenticationComponent implements OnInit {

  private authenticationService = inject(AuthenticationFacadeService);

  ngOnInit() {
    this.authenticationService.logoutUserFromContainer();
  }
}
