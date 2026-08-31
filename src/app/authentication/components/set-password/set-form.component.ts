import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthenticationFormComponent } from '@home-budget/authentication/components/authentication-form.component';

@Component({
    selector: 'hb-set-form',
    templateUrl: './set-form.component.html',
    styleUrls: ['./set-form.component.scss'],
    standalone: false
})
export class SetFormComponent extends AuthenticationFormComponent implements OnInit {

  @ViewChild('passwordHTML') passwordHTML: ElementRef;

  ngOnInit(): void {
    setTimeout(() => {
      this.passwordHTML.nativeElement.focus();
    }, 100);
  }

}
