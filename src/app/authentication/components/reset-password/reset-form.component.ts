import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { TranslatePipe } from '@ngx-translate/core';

import { AuthenticationFormComponent } from '@home-budget/authentication/components/authentication-form.component';

@Component({
  selector: 'hb-reset-form',
  templateUrl: './reset-form.component.html',
  styleUrls: ['./reset-form.component.scss'],
  imports: [ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatError, MatButton, RouterLink, TranslatePipe]
})
export class ResetFormComponent extends AuthenticationFormComponent implements OnInit {
  @ViewChild('emailHTML') emailHTML!: ElementRef;

  ngOnInit(): void {
    setTimeout(() => {
      this.emailHTML.nativeElement.focus();
    }, 100);
  }

}
