import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticationFacadeService } from '@authentication/store';
import { AuthenticationStoreModule } from '@authentication/store/authentication-store.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from 'src/environments/environment';
import { AppHeaderComponent } from '..';
import { Observable, of } from 'rxjs';

const mockRouter = {
  navigate: jasmine.createSpy('navigate'),
};

export class AuthenticationFacadeServiceStub {
  isSuccess$: Observable<boolean>;

  constructor() {
    this.isSuccess$ = of(true);
  }

  logoutUser() {
    //
  }
}

fdescribe('AppHeaderComponent', () => {
  let component: AppHeaderComponent;
  let fixture: ComponentFixture<AppHeaderComponent>;

  let translateServiceStub: TranslateService;
  let authServiceStub: AuthenticationFacadeService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppHeaderComponent ],
      imports: [
        AngularFireModule.initializeApp(environment.firebase, 'home-budget'),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        AuthenticationStoreModule,
        EffectsModule.forRoot(),
        StoreModule.forRoot({}),
        BrowserAnimationsModule,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        }),
        SharedModule,
      ],
      providers: [
        { provide: AuthenticationFacadeService, useClass: AuthenticationFacadeServiceStub },
        { provide: Router, useValue: mockRouter },
        TranslateService,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppHeaderComponent);
    component = fixture.componentInstance;
    translateServiceStub = TestBed.get(TranslateService);
    authServiceStub = TestBed.get(AuthenticationFacadeService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should set language while calling 'onChangeLanguage' method`, () => {
    spyOn(translateServiceStub, 'use');

    component.onChangeLanguage();
    expect(component.currentLang).toBe('PL');

    component.currentLang = 'PL';
    component.onChangeLanguage();
    expect(component.currentLang).toBe('EN');
  });

  it(`should redirect to 'login' route afer logout succeeded`, () => {
    component.onLogout();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['./login']);
  });
});
