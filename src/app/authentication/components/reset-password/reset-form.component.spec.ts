import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { provideTranslateService } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { environment } from 'src/environments/environment';
import { AuthenticationFormComponent } from '../authentication-form.component';
import { ResetFormComponent } from './reset-form.component';

describe('ResetFormComponent', () => {
  let component: ResetFormComponent;
  let fixture: ComponentFixture<ResetFormComponent>;

  const formBuilder: UntypedFormBuilder = new UntypedFormBuilder();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ResetFormComponent,
        AuthenticationFormComponent
      ],
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        ReactiveFormsModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot(),
        SharedModule,
      ],
      providers: [
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideDatabase(() => getDatabase()),
        provideTranslateService(),
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetFormComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('form', formBuilder.group({
      email: null,
      name: null,
      password: null,
    }));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
