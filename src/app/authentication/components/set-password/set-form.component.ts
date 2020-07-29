import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as fromServices from '../../services';
import { AuthenticationFormComponent } from '../authentication-form.component';

@Component({
  selector: 'hb-set-form',
  templateUrl: './set-form.component.html',
  styleUrls: ['./set-form.component.scss']
})
export class SetFormComponent extends AuthenticationFormComponent implements OnInit {

  @ViewChild('passwordHTML') passwordHTML: ElementRef;

  constructor(
    authenticationUtilsService: fromServices.AuthenticationUtilsService,
  ) { super(authenticationUtilsService) }

  ngOnInit(): void {
    setTimeout(() => {
      this.passwordHTML.nativeElement.focus();
    }, 100);
  }

}
