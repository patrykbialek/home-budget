import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthenticationFacadeService } from '@home-budget/authentication/store';

@Component({
    selector: 'hb-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.scss'],
    imports: [RouterOutlet]
})
export class AuthenticationComponent implements OnInit {
  private authenticationService = inject(AuthenticationFacadeService);

  ngOnInit() {
    this.authenticationService.logoutUserFromContainer();
  }
}
