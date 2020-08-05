import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticationUtilsService } from '@authentication/services';
import { AuthenticationFacadeService } from '@authentication/store';
import { AuthenticationStoreModule } from '@authentication/store/authentication-store.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommonWithAnimationComponent } from '../../../shared/components';
import { RegisterUserComponent } from './register-user.component';
import { Router } from '@angular/router';

export class AuthenticationUtilsServiceStub {
  private validators = {
    email: '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'
  };
  get emailPattern() {
    return this.validators.email;
  }
}

export class AuthenticationFacadeServiceStub {
  isSuccess$: Observable<boolean>;

  constructor() {
    this.isSuccess$ = of(true);
  }

  registerUser(payload?: any) {
    //
  }
}

const mockRouter = {
  navigate: jasmine.createSpy('navigate'),
};

fdescribe('RegisterUserComponent', () => {
  let component: RegisterUserComponent;
  let fixture: ComponentFixture<RegisterUserComponent>;

  const formBuilder: FormBuilder = new FormBuilder();
  let authenticationServiceStub: AuthenticationFacadeService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterUserComponent, CommonWithAnimationComponent],
      imports: [
        AngularFireModule.initializeApp(environment.firebase, 'home-budget'),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        AuthenticationStoreModule,
        EffectsModule.forRoot(),
        StoreModule.forRoot({}),
        SharedModule,

        BrowserAnimationsModule,
        RouterTestingModule,
        ReactiveFormsModule,

        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        }),
      ],
      providers: [
        // AuthenticationFacadeService,
        TranslateService,
        { provide: AuthenticationUtilsService, useClass: AuthenticationUtilsServiceStub },
        { provide: AuthenticationFacadeService, useClass: AuthenticationFacadeServiceStub },
        { provide: FormBuilder, useValue: formBuilder },
        { provide: Router, useValue: mockRouter },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterUserComponent);
    component = fixture.componentInstance;
    authenticationServiceStub = TestBed.get(AuthenticationFacadeService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should call 'createForm' method on init`, () => {
    const createFormSpy = spyOn(component, 'createForm');

    component.ngOnInit();
    expect(createFormSpy).toHaveBeenCalledTimes(1);
  });

  it(`it should create registerForm while calling 'createForm' method`, () => {
    component.createForm();
    expect(component.registerForm.get('name')).not.toBeNull();
    expect(component.registerForm.get('email')).not.toBeNull();
    expect(component.registerForm.get('password')).not.toBeNull();
  });


  it(`it should create 'name' control with validations: required`, () => {
    component.createForm();
    const nameControl = component.registerForm.get('name');

    const requiredValidator = nameControl.hasError('required');
    expect(requiredValidator).toBeTruthy();
  });

  it(`it should create 'email' control with validations: required, email and pattern`, () => {
    component.createForm();
    const emailControl = component.registerForm.get('email');

    const requiredValidator = emailControl.hasError('required');
    expect(requiredValidator).toBeTruthy();
    emailControl.setValue('dd');

    const emailValidator = emailControl.hasError('email');
    expect(emailValidator).toBeTruthy();
    emailControl.setValue('patryk.b@me');

    const patternValidator = emailControl.hasError('pattern');
    expect(patternValidator).toBeTruthy();
  });

  it(`it should create 'password' control with validations: required`, () => {
    component.createForm();
    const passwordControl = component.registerForm.get('password');

    const requiredValidator = passwordControl.hasError('required');
    expect(requiredValidator).toBeTruthy();
  });

  it(`should call 'registerUser' method in 'authenticationService' service while 'registerUser' is called`, () => {
    const registerUserSpy = spyOn(authenticationServiceStub, 'registerUser');
    const event = { value: null } as FormGroup;

    component.registerUser(event);
    expect(registerUserSpy).toHaveBeenCalledWith({ key: null, value: null });
  });

  it(`should redirect to 'dashboard' route afer registerUser succeeded`, () => {
    spyOn(authenticationServiceStub, 'registerUser');
    const event = { value: null } as FormGroup;

    component.registerUser(event);
    expect(mockRouter.navigate).toHaveBeenCalledWith([component.afterSuccessRouteUrl]);
  });
});
