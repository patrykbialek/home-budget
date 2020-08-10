import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticationFacadeService } from '@authentication/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedUtilsService } from '@shared/services/shared-utils.service';
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';

export class AuthenticationFacadeServiceStub {
  user$: Observable<any>;

  constructor() {
    this.user$ = of(null);
  }

  setUser(payload: any) {
    this.user$ = of(payload);
  }
}

export class AngularFireAuthStub {
  readonly authState: Observable<any>;

  constructor() {
    this.authState = of({
      displayName: 'name',
      email: 'email',
      uid: 'uid'
    });
  }
};

fdescribe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  let angularFireAuthStub: AngularFireAuth;
  let authenticationServiceStub: AuthenticationFacadeService;
  let sharedUtilsServiceStub: SharedUtilsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AngularFireModule.initializeApp(environment.firebase, 'home-budget'),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        EffectsModule.forRoot(),
        StoreModule.forRoot({}),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        }),
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: AngularFireAuth, useClass: AngularFireAuthStub },
        { provide: AuthenticationFacadeService, useClass: AuthenticationFacadeServiceStub },
        SharedUtilsService,
        TranslateService,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    angularFireAuthStub = TestBed.get(AngularFireAuth);
    sharedUtilsServiceStub = TestBed.get(SharedUtilsService);
    authenticationServiceStub = TestBed.get(AuthenticationFacadeService);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should set 'user$' when called ngOnInit and 'user' is null`, () => {
    const result = {
      displayName: 'name',
      email: 'email',
      uid: 'uid'
    };

    authenticationServiceStub.setUser(null);
    component.ngOnInit();
    const sub2 = authenticationServiceStub.user$
      .pipe(
        tap(response => expect(response).toEqual(result))
      ).subscribe();
    sub2.unsubscribe();
  });

  it(`should call 'setIsMobileSize' method from 'sharedUtilsService' service when called ngOnInit`, () => {
    const setIsMobileSizeSpy = spyOn(sharedUtilsServiceStub, 'setIsMobileSize');
    component.ngOnInit();
    expect(setIsMobileSizeSpy).toHaveBeenCalled();
  });

  it(`should call 'setIsMobileSize' method from 'sharedUtilsService' service when called onResize`, () => {
    const setIsMobileSizeSpy = spyOn(sharedUtilsServiceStub, 'setIsMobileSize');
    component.onResize({ target: { innerWidth: 100 } });
    expect(setIsMobileSizeSpy).toHaveBeenCalled();
  });
});
