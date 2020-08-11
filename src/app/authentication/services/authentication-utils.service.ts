import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

const messages = {
  email: 'AUTHENTICATION.ValidationMessages.Email',
  minlength: 'AUTHENTICATION.ValidationMessages.Minlength',
  required: 'AUTHENTICATION.ValidationMessages.Required',
};

@Injectable({
  providedIn: 'root'
})
export class AuthenticationUtilsService {

  private validators = {
    email: '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'
  };

  get emailPattern() {
    return this.validators.email;
  }

  getErrorMessageForName(formControl: FormControl): string {
    if (formControl.hasError('required')) {
      return messages.required;
    }
  }

  getErrorMessageForEmail(formControl: FormControl): string {
    if (formControl.hasError('required')) {
      return messages.required;
    }

    if (formControl.hasError('email') || formControl.hasError('pattern')) {
      return messages.email;
    }
  }

  getErrorMessageForPassword(formControl: FormControl): string {
    if (formControl.hasError('required')) {
      return messages.required;
    }

    if (formControl.hasError('minlength')) {
      return messages.minlength;
    }
  }

}
