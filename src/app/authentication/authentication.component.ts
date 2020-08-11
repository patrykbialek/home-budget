import { Component, OnInit } from '@angular/core';
import { AuthenticationFacadeService } from '@home-budget/authentication/store';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationFacadeService,
  ) { }

  ngOnInit() {
    this.authenticationService.logoutUserFromContainer();
  }
}
