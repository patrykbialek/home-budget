import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as fromServices from '../../services';

@Component({
  selector: 'hb-set-form',
  templateUrl: './set-form.component.html',
  styleUrls: ['./set-form.component.scss']
})
export class SetFormComponent implements OnInit {
  hide = true;

  @Input() setForm: FormGroup;
  @Output() setPassword = new EventEmitter();

  @ViewChild('passwordHTML') passwordHTML: ElementRef;

  constructor(
    private authenticationUtilsService: fromServices.AuthenticationUtilsService,
  ) { }

  get passwordControl(): FormControl { return this.setForm.get('password') as FormControl; }


  ngOnInit(): void {
    setTimeout(() => {
      this.passwordHTML.nativeElement.focus();
    }, 100);
  }

  getErrorMessageForPassword() {
    return this.authenticationUtilsService.getErrorMessageForPassword(this.passwordControl);
  }

  onSet() {
    this.setForm.valid
      ? this.setPassword.emit(this.setForm)
      : this.setForm.markAllAsTouched();
  }

}
