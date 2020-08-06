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
import { SetPasswordComponent } from './set-password.component';
import { Router, ActivatedRoute } from '@angular/router';

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

  setPassword(payload?: any) {
    //
  }

  logoutUser() { }

}

const mockRouter = {
  navigate: jasmine.createSpy('navigate'),
};

fdescribe('SetPasswordComponent', () => {
  let component: SetPasswordComponent;
  let fixture: ComponentFixture<SetPasswordComponent>;

  const formBuilder: FormBuilder = new FormBuilder();
  let authenticationServiceStub: AuthenticationFacadeService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SetPasswordComponent, CommonWithAnimationComponent],
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
        TranslateService,
        { provide: AuthenticationUtilsService, useClass: AuthenticationUtilsServiceStub },
        { provide: AuthenticationFacadeService, useClass: AuthenticationFacadeServiceStub },
        { provide: FormBuilder, useValue: formBuilder },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {
                oobCode: undefined
              }
            }
          }
        }
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetPasswordComponent);
    component = fixture.componentInstance;
    authenticationServiceStub = TestBed.get(AuthenticationFacadeService);
    fixture.detectChanges();
  });

  it('should create', () => {
    const redirectToLoginIfNoCodeParamSpy = spyOn(component, 'redirectToLoginIfNoCodeParam');
    const createFormSpy = spyOn(component, 'createForm');
    expect(component).toBeTruthy();
  });

  it(`should call 'createForm' method on init`, () => {
    const redirectToLoginIfNoCodeParamSpy = spyOn(component, 'redirectToLoginIfNoCodeParam');
    const createFormSpy = spyOn(component, 'createForm');
    const logoutSpy = spyOn(authenticationServiceStub, 'logoutUser');

    component.ngOnInit();
    expect(createFormSpy).toHaveBeenCalledTimes(1);
    expect(logoutSpy).toHaveBeenCalledTimes(1);
  });

  it(`it should create setForm while calling 'createForm' method`, () => {
    component.createForm();
    expect(component.setForm.get('password')).not.toBeNull();
  });

  it(`it should create 'password' control with validations: required, minLength(6)`, () => {
    component.createForm();
    const passwordControl = component.setForm.get('password');

    const requiredValidator = passwordControl.hasError('required');
    expect(requiredValidator).toBeTruthy();
    passwordControl.setValue('1');

    const minLengthValidator = passwordControl.hasError('minlength');
    expect(minLengthValidator).toBeTruthy();
  });

  it(`should call 'setPassword' method in 'authenticationService' service while 'setPassword' is called`, () => {
    const setPasswordSpy = spyOn(authenticationServiceStub, 'setPassword');
    const event = { value: {} } as FormGroup;

    component.setPassword(event);
    expect(setPasswordSpy).toHaveBeenCalledWith({ key: null, value: { code: undefined } });
  });

  it(`should redirect to 'login' route afer setPassword succeeded`, () => {
    spyOn(authenticationServiceStub, 'setPassword');
    const event = { value: {} } as FormGroup;

    component.setPassword(event);
    expect(mockRouter.navigate).toHaveBeenCalledWith([component.loginRouteUrl]);
  });

  it(`should redirect to 'login' route if code param not provided`, () => {
    component.redirectToLoginIfNoCodeParam();
    expect(mockRouter.navigate).toHaveBeenCalledWith([component.loginRouteUrl]);
  });
});
