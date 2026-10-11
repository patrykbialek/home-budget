import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatFormField, MatLabel, MatError, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { TranslatePipe } from '@ngx-translate/core';

import { AuthenticationFormComponent } from '@home-budget/authentication/components/authentication-form.component';

@Component({
  selector: 'hb-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
  imports: [ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatError, MatIconButton, MatSuffix, MatIcon, MatButton, RouterLink, TranslatePipe]
})
export class RegisterFormComponent extends AuthenticationFormComponent implements OnInit {
  @ViewChild('nameHTML') nameHTML!: ElementRef;

  ngOnInit(): void {
    setTimeout(() => {
      this.nameHTML.nativeElement.focus();
    });
  }

}
