import { Injectable, Inject } from "@angular/core";
import { FormGroup, FormControl } from '@angular/forms';

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
      return 'AUTHENTICATION.ValidationMessages.Required';
    }
  }

  getErrorMessageForEmail(formControl: FormControl): string {
    if (formControl.hasError('required')) {
      return 'AUTHENTICATION.ValidationMessages.Required';
    }

    if (formControl.hasError('email') || formControl.hasError('pattern')) {
      return 'AUTHENTICATION.ValidationMessages.Email';
    }
  }

  getErrorMessageForPassword(formControl: FormControl): string {
    if (formControl.hasError('required')) {
      return 'AUTHENTICATION.ValidationMessages.Required';
    }

    if (formControl.hasError('minlength')) {
      return 'AUTHENTICATION.ValidationMessages.Minlength';
    }
  }

}
