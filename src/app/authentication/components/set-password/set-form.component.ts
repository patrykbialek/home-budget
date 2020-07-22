import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

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

  constructor() { }

  get passwordControl() { return this.setForm.get('password'); }

  ngOnInit(): void {
    setTimeout(() => {
      this.passwordHTML.nativeElement.focus();
    }, 100);
  }

  getErrorMessageForPassword() {
    if (this.passwordControl.hasError('required')) {
      return 'Pole wymagane.';
    }
  }

  onSet() {
    if (this.setForm.valid) {
      this.setPassword.emit(this.setForm)
    } else {
      this.setForm.markAllAsTouched();
    }
  }

}
