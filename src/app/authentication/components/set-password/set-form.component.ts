import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as fromServices from '@home-budget/authentication/services';
import { AuthenticationFormComponent } from '@home-budget/authentication/components/authentication-form.component';

@Component({
  selector: 'hb-set-form',
  templateUrl: './set-form.component.html',
  styleUrls: ['./set-form.component.scss']
})
export class SetFormComponent extends AuthenticationFormComponent implements OnInit {

  @ViewChild('passwordHTML') passwordHTML: ElementRef;

  constructor(
    authenticationUtilsService: fromServices.AuthenticationUtilsService,
  ) { super(authenticationUtilsService); }

  ngOnInit(): void {
    setTimeout(() => {
      this.passwordHTML.nativeElement.focus();
    }, 100);
  }

}
