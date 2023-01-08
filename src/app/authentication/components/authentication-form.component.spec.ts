// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { AuthenticationFormComponent } from './authentication-form.component';
// import { AuthenticationUtilsService } from '../services';
// import { SharedModule } from '@shared/shared.module';
// import { FormBuilder, FormControl } from '@angular/forms';
// import { StoreModule } from '@ngrx/store';
// import { EffectsModule } from '@ngrx/effects';
// import { AuthenticationStoreModule } from '@authentication/store/authentication-store.module';
// import { AngularFireModule } from '@angular/fire';
// import { AngularFireDatabaseModule } from '@angular/fire/database';
// import { AngularFireAuthModule } from 'angularfire2/auth';
// import { environment } from 'src/environments/environment';

// fdescribe('AuthenticationFormComponent', () => {
//   let component: AuthenticationFormComponent;
//   let fixture: ComponentFixture<AuthenticationFormComponent>;

//   const formBuilder: FormBuilder = new FormBuilder();

//   let authenticationUtilsServiceStub: AuthenticationUtilsService;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [AuthenticationFormComponent],
//       providers: [
//         AuthenticationUtilsService,
//         { provide: FormBuilder, useValue: formBuilder },
//       ],
//       imports: [
//         AngularFireModule.initializeApp(environment.firebase, 'home-budget'),
//         AngularFireDatabaseModule,
//         AngularFireAuthModule,
//         AuthenticationStoreModule,
//         EffectsModule.forRoot(),
//         StoreModule.forRoot({}),
//         SharedModule
//       ]
//     })
//       .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(AuthenticationFormComponent);
//     component = fixture.componentInstance;
//     authenticationUtilsServiceStub = TestBed.get(AuthenticationUtilsService);

//     component.form = formBuilder.group({
//       email: null,
//       name: null,
//       password: null,
//     });

//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it(`should call 'getErrorMessageForEmail' method from utils service`, () => {
//     const getErrorMessageForEmailSpy =
//       spyOn(authenticationUtilsServiceStub, 'getErrorMessageForEmail');

//     const emailControl = component.emailControl as FormControl;

//     component.getErrorMessageForEmail();
//     expect(getErrorMessageForEmailSpy).toHaveBeenCalledWith(emailControl);
//   });

//   it(`should call 'getErrorMessageForName' method from utils service`, () => {
//     const getErrorMessageForNameSpy =
//       spyOn(authenticationUtilsServiceStub, 'getErrorMessageForName');

//     const nameControl = component.nameControl as FormControl;

//     component.getErrorMessageForName();
//     expect(getErrorMessageForNameSpy).toHaveBeenCalledWith(nameControl);
//   });

//   it(`should call 'getErrorMessageForPassword' method from utils service`, () => {
//     const getErrorMessageForPasswordSpy =
//       spyOn(authenticationUtilsServiceStub, 'getErrorMessageForPassword');

//     const passwordControl = component.passwordControl as FormControl;

//     component.getErrorMessageForPassword();
//     expect(getErrorMessageForPasswordSpy).toHaveBeenCalledWith(passwordControl);
//   });

//   it(`should emit 'onSubmitAction' method while form valid`, () => {
//     const onSubmitActionSpy = spyOn(component.onSubmitAction, 'emit');

//     component.onSubmit();
//     expect(onSubmitActionSpy).toHaveBeenCalledWith(component.form);
//   });
// });
