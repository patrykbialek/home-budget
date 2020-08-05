import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationStoreModule } from '@authentication/store/authentication-store.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { AngularFireAuthModule } from 'angularfire2/auth';
import * as moment from 'moment';
import 'moment/locale/pl';
import { environment } from 'src/environments/environment';
import { FiltersComponent } from './filters.component';
import { of } from 'rxjs';

fdescribe('FiltersComponent', () => {
  let component: FiltersComponent;
  let fixture: ComponentFixture<FiltersComponent>;

  const formBuilder: FormBuilder = new FormBuilder();
  let translateServiceStub = TranslateService;

  class TranslateServiceStub {
    setDefaultLang(lang: string) { }
    use(lang: string) { }
    get currentLang() { return of({ lang: 'pl'});}
    get onLangChange() { return of({ lang: 'pl' }); }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FiltersComponent],
      imports: [
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebase, 'home-budget'),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        AuthenticationStoreModule,
        EffectsModule.forRoot(),
        StoreModule.forRoot({}),
        SharedModule,

        BrowserAnimationsModule,

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
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersComponent);
    component = fixture.componentInstance;

    translateServiceStub = TestBed.get(TranslateService);
    component.filterForm = formBuilder.group({
      category: [null],
      period: [null],
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when ngOnInit', () => {
    it(`should createForm`, () => {
      component.ngOnInit();

      expect(component.filterForm.get('category').value).toBeNull();
      expect(component.filterForm.get('period').value).toBeNull();
    });

    it(`should set defaultQueryValues`, () => {
      component.ngOnInit();

      component.categories$
        .subscribe((response) => {
          expect(component.categoryControl.value).toEqual(response[0]);
        });

      component.periods$
        .subscribe((response) => {
          expect(component.periodControl.value).toEqual(response[0]);
        });
    });

    it(`should set listenerOnCategoryChange`, () => {
      component.ngOnInit();

      component.categoryControl.setValue({ id: 1, name: 'test', });
      expect(component.query.category).toEqual('test');
    });

    it(`should set listenerOnPeriodChange`, () => {
      component.ngOnInit();

      component.periodControl.setValue({ id: 'currentMonth', name: 'test', });
      expect(component.query.periodFrom).toEqual(moment().startOf('month').format('YYYY-MM-DD'));
      expect(component.query.periodTo).toEqual(moment().endOf('month').format('YYYY-MM-DD'));

      component.periodControl.setValue({ id: 'previousMonth', name: 'test', });
      expect(component.query.periodFrom).toEqual(moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD'));
      expect(component.query.periodTo).toEqual(moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD'));

      component.periodControl.setValue({ id: 'last3Months', name: 'test', });
      expect(component.query.periodFrom).toEqual(moment().subtract(3, 'months').startOf('month').format('YYYY-MM-DD'));
      expect(component.query.periodTo).toEqual(moment().subtract(0, 'months').endOf('month').format('YYYY-MM-DD'));

      component.periodControl.setValue({ id: 'last6Months', name: 'test', });
      expect(component.query.periodFrom).toEqual(moment().subtract(6, 'months').startOf('month').format('YYYY-MM-DD'));
      expect(component.query.periodTo).toEqual(moment().subtract(0, 'months').endOf('month').format('YYYY-MM-DD'));

      component.periodControl.setValue({ id: 'currentYear', name: 'test', });
      expect(component.query.periodFrom).toEqual(moment().startOf('year').format('YYYY-MM-DD'));
      expect(component.query.periodTo).toEqual(moment().format('YYYY-MM-DD'));
    });

    it(`should set queryPeriodLabels`, () => {
      component.ngOnInit();

      expect(component.currentMonth).not.toBe(null);
      expect(component.previousMonth).not.toBe(null);
      expect(component.currentYear).not.toBe(null);
    });
  });

});
