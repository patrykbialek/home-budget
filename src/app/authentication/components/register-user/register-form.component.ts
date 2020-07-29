import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as fromServices from '../../services';
import { AuthenticationFormComponent } from '../authentication-form.component';

@Component({
  selector: 'hb-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent extends AuthenticationFormComponent implements OnInit {

  @ViewChild('nameHTML') nameHTML: ElementRef;

  constructor(
    authenticationUtilsService: fromServices.AuthenticationUtilsService,
  ) { super(authenticationUtilsService) }

  ngOnInit(): void {
    setTimeout(() => {
      this.nameHTML.nativeElement.focus();
    });
  }

}
