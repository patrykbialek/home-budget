import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { FormComponent } from './form.component';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthenticationStoreModule } from '@authentication/store/authentication-store.module';

fdescribe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormComponent],
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
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;

    component.transactionForm = formBuilder.group({
      amount: [null, [Validators.required]],
      category: [null, [Validators.required]],
      date: [null, [Validators.required]],
      recipient: [null, [Validators.required]],
      type: [null, [Validators.required]],
      notes: [''],
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  beforeEach(() => {
    spyOn(component.amountHTML.nativeElement, 'focus');
  });

  it('should set focus on amountHMTL element', fakeAsync(() => {
    component.ngAfterViewInit();
    tick(0);
    fixture.detectChanges();

    expect(component.amountHTML.nativeElement.focus).toHaveBeenCalled();
  }));

  it(`should return 'TRANSACTION.ValidationMessages.Required' message when form controls have 'required' error`, () => {
    component.amountControl.setErrors({ required: true });
    component.categoryControl.setErrors({ required: true });
    component.categoryControl.setErrors({ required: true });
    component.recipientControl.setErrors({ required: true });

    const errorMessage = component.getErrorMessage();
    expect(errorMessage).toBe('TRANSACTION.ValidationMessages.Required');
  });

  it(`should emit 'deleteItem' when calling 'onDelete' method`, () => {
    const deleteItemEmitSpy = spyOn(component.deleteItem, 'emit');

    component.onDelete();
    expect(deleteItemEmitSpy).toHaveBeenCalled();
  });

  it(`should emit 'saveData' when calling 'onSave' method`, () => {
    const saveDataEmitSpy = spyOn(component.saveData, 'emit');
    component.amountControl.setValue(200);
    component.categoryControl.setValue({ id: 1 });
    component.dateControl.setValue(new Date());
    component.recipientControl.setValue({ id: 1 });
    component.typeControl.setValue({ id: 1 });

    component.onSave();
    expect(saveDataEmitSpy).toHaveBeenCalled();
  });

  it(`should call 'markAllAsTouched' method if form invalid`, () => {
    const markAllAsTouchedSpy = spyOn(component.transactionForm, 'markAllAsTouched');

    component.onSave();
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
  });
});
