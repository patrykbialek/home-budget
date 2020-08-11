import { TestBed, inject } from '@angular/core/testing';
import { AuthenticationUtilsService } from '.';
import { FormControl, Validators } from '@angular/forms';

const messages = {
  email: 'AUTHENTICATION.ValidationMessages.Email',
  minlength: 'AUTHENTICATION.ValidationMessages.Minlength',
  required: 'AUTHENTICATION.ValidationMessages.Required',
};

fdescribe('AuthenticationUtilsService', () => {
  let service: AuthenticationUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthenticationUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when getErrorMessageForName', whenGetErrorMessageForName);
  describe('when getErrorMessageForEmail', whenGetErrorMessageForEmail);
  describe('when getErrorMessageForPassword', whenGetErrorMessageForPassword);
});

function whenGetErrorMessageForName() {
  let service: AuthenticationUtilsService;

  beforeEach(inject([],
    () => {
      service = new AuthenticationUtilsService();
    }));

  it(`should return error message for name control`, () => {
    const message = messages.required;
    let formControl: FormControl;
    let resultMessage: string;

    formControl = new FormControl('', Validators.required);
    resultMessage = service.getErrorMessageForName(formControl);
    expect(resultMessage).toEqual(message);

    formControl = new FormControl('');
    resultMessage = service.getErrorMessageForName(formControl);
    expect(resultMessage).toBeUndefined();
  });
}

function whenGetErrorMessageForEmail() {
  let service: AuthenticationUtilsService;

  beforeEach(inject([],
    () => {
      service = new AuthenticationUtilsService();
    }));

  it(`should return error message for email control`, () => {
    let messageRequired = messages.required;
    let formControlRequired: FormControl;
    let resultMessageRequired: string;

    formControlRequired = new FormControl('', Validators.required);
    resultMessageRequired = service.getErrorMessageForEmail(formControlRequired);
    expect(resultMessageRequired).toEqual(messageRequired);

    formControlRequired = new FormControl('');
    resultMessageRequired = service.getErrorMessageForEmail(formControlRequired);
    expect(resultMessageRequired).toBeUndefined();

    let messageEmail = messages.email;
    let formControlEmail: FormControl;
    let resultMessageEmail: string;

    formControlEmail = new FormControl('', [Validators.email, Validators.pattern(service.emailPattern)]);
    formControlEmail.setValue('sdfsf');
    resultMessageEmail = service.getErrorMessageForEmail(formControlEmail);
    expect(resultMessageEmail).toEqual(messageEmail);

    formControlEmail = new FormControl('');
    resultMessageEmail = service.getErrorMessageForEmail(formControlEmail);
    expect(resultMessageEmail).toBeUndefined();
  });
}

function whenGetErrorMessageForPassword() {
  let service: AuthenticationUtilsService;

  beforeEach(inject([],
    () => {
      service = new AuthenticationUtilsService();
    }));

  it(`should return error message for password control`, () => {
    let messageRequired = messages.required;
    let formControlRequired: FormControl;
    let resultMessageRequired: string;

    formControlRequired = new FormControl('', Validators.required);
    resultMessageRequired = service.getErrorMessageForPassword(formControlRequired);
    expect(resultMessageRequired).toEqual(messageRequired);

    formControlRequired = new FormControl('');
    resultMessageRequired = service.getErrorMessageForPassword(formControlRequired);
    expect(resultMessageRequired).toBeUndefined();

    let messageMinlength = messages.minlength;
    let formControlEmail: FormControl;
    let resultMessageEmail: string;

    formControlEmail = new FormControl('', [Validators.minLength(6)]);
    formControlEmail.setValue('123');
    resultMessageEmail = service.getErrorMessageForPassword(formControlEmail);
    expect(resultMessageEmail).toEqual(messageMinlength);

    formControlEmail = new FormControl('');
    resultMessageEmail = service.getErrorMessageForPassword(formControlEmail);
    expect(resultMessageEmail).toBeUndefined();
  });
}
