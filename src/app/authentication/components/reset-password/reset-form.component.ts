import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as fromServices from '../../services';
import { AuthenticationFormComponent } from '../authentication-form.component';

@Component({
  selector: 'hb-reset-form',
  templateUrl: './reset-form.component.html',
  styleUrls: ['./reset-form.component.scss']
})
export class ResetFormComponent extends AuthenticationFormComponent implements OnInit {

  @ViewChild('emailHTML') emailHTML: ElementRef;

  constructor(
    authenticationUtilsService: fromServices.AuthenticationUtilsService,
  ) { super(authenticationUtilsService); }

  ngOnInit(): void {
    setTimeout(() => {
      this.emailHTML.nativeElement.focus();
    }, 100);
  }

}
