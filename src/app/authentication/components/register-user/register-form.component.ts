import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthenticationFormComponent } from '@home-budget/authentication/components/authentication-form.component';

@Component({
    selector: 'hb-register-form',
    templateUrl: './register-form.component.html',
    styleUrls: ['./register-form.component.scss'],
    standalone: false
})
export class RegisterFormComponent extends AuthenticationFormComponent implements OnInit {

  @ViewChild('nameHTML') nameHTML: ElementRef;

  ngOnInit(): void {
    setTimeout(() => {
      this.nameHTML.nativeElement.focus();
    });
  }

}
