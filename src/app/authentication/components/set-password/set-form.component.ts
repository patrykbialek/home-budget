import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthenticationFormComponent } from '@home-budget/authentication/components/authentication-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel, MatSuffix, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

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
