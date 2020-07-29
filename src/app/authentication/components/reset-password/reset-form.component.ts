import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as fromServices from '../../services';

@Component({
  selector: 'hb-reset-form',
  templateUrl: './reset-form.component.html',
  styleUrls: ['./reset-form.component.scss']
})
export class ResetFormComponent implements OnInit {

  @Input() resetForm: FormGroup;
  @Output() resetPassword = new EventEmitter();

  @ViewChild('emailHTML') emailHTML: ElementRef;

  constructor(
    private authenticationUtilsService: fromServices.AuthenticationUtilsService,
  ) { }

  get emailControl(): FormControl { return this.resetForm.get('email') as FormControl; }

  ngOnInit(): void {
    setTimeout(() => {
      this.emailHTML.nativeElement.focus();
    }, 100);
  }

  getErrorMessageForEmail() {
    return this.authenticationUtilsService.getErrorMessageForEmail(this.emailControl);
  }

  onReset() {
    this.resetForm.valid
      ? this.resetPassword.emit(this.resetForm)
      : this.resetForm.markAllAsTouched();
  }

}
