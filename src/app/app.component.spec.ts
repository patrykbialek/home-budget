import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from 'src/environments/environment';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AuthenticationFacadeService } from '@authentication/store';
import { of } from 'rxjs';

fdescribe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  const authStub: any = {
    authState: {
      uid: '17WvU2Vj58SnTz8v7EqyYYb0WRc2'
    },
  };

  let authenticationFacadeServiceStub: AuthenticationFacadeService;

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
        { provide: AngularFireAuth, useValue: authStub },
        AuthenticationFacadeService,
        TranslateService,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    authenticationFacadeServiceStub = TestBed.get(AuthenticationFacadeService);
    authStub.authState = of({ uid: '17WvU2Vj58SnTz8v7EqyYYb0WRc2' });
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should create the app', () => {
    const getUserSpy = spyOn(authenticationFacadeServiceStub, 'getUser');
    component.ngOnInit();
    expect(getUserSpy).toHaveBeenCalledWith('17WvU2Vj58SnTz8v7EqyYYb0WRc2');
  });
});
