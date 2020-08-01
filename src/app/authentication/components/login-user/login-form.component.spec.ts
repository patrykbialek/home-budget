import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticationStoreModule } from '@authentication/store/authentication-store.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from 'src/environments/environment';
import { AuthenticationFormComponent } from '../authentication-form.component';
import { LoginFormComponent } from './login-form.component';


fdescribe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoginFormComponent,
        AuthenticationFormComponent
      ],
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
        { provide: FormBuilder, useValue: formBuilder },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;

    component.form = formBuilder.group({
      email: null,
      name: null,
      password: null,
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
