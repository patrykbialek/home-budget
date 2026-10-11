import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatFormField, MatLabel, MatSuffix, MatError } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { TranslatePipe } from '@ngx-translate/core';

import { AuthenticationFormComponent } from '@home-budget/authentication/components/authentication-form.component';

@Component({
  selector: 'hb-set-form',
  templateUrl: './set-form.component.html',
  styleUrls: ['./set-form.component.scss'],
  imports: [ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatIconButton, MatSuffix, MatIcon, MatError, MatButton, RouterLink, TranslatePipe]
})
export class SetFormComponent extends AuthenticationFormComponent implements OnInit {
  @ViewChild('passwordHTML') passwordHTML!: ElementRef;

  ngOnInit(): void {
    setTimeout(() => {
      this.passwordHTML.nativeElement.focus();
    }, 100);
  }

}
