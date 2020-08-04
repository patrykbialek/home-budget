import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationHttpService } from '@authentication/services';
import { AuthenticationStoreModule } from '@authentication/store/authentication-store.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonWithAnimationComponent } from '@shared/components';
import { SharedModule } from '@shared/shared.module';
import { TransactionsFacadeService } from '@transactions/store';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Observable, of, Subject, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ActivatedRouteStub } from '../../../../testing/activated-route-stub';
import { TransactionDetailComponent } from './transaction-detail.component';
import { Transaction, TransactionType } from '@transactions/models';

export const transaction = {
  account: null,
  amount: 200,
  category: 'finance',
  date: new Date('2020-08-04'),
  inBugdet: false,
  key: '321',
  recipient: 'Test',
  type: TransactionType.Expense,
};

export class AuthenticationServiceStub {
  authState$: Observable<any>;

  constructor() {
    this.authState$ = of({ uid: '123' });
  }
}

export class TransactionsFacadeServiceStub_ {
  isSuccess$: Observable<boolean>;
  transaction$: Observable<any>;

  constructor() {
    this.isSuccess$ = of(true);
    this.transaction$ = of(transaction);
  }

  createTransaction(payload: any) { }
  deleteTransaction(payload: any) { }
  updateTransaction(payload: any) { }
}

export class TransactionsFacadeServiceStub {
  private isSuccessSubject = new ReplaySubject<boolean>();
  private transactionSubject = new ReplaySubject<Transaction>();

  constructor(value?: { transaction?: Transaction, isSuccess?: boolean }) {
    if (value) {
      this.setIsSuccess(value.isSuccess);
      this.setTransaction(value.transaction);
    }
  }

  readonly isSuccess$ = this.isSuccessSubject.asObservable();
  readonly transaction$ = this.transactionSubject.asObservable();

  createTransaction(payload: any) { }
  deleteTransaction(payload: any) { }
  updateTransaction(payload: any) { }

  setIsSuccess(isSuccess: boolean) {
    this.isSuccessSubject.next(isSuccess);
  }

  setTransaction(transaction: Transaction) {
    this.transactionSubject.next(transaction);
  }
}

let mockRouter = {
  navigate: jasmine.createSpy('navigate'),
};

let component: TransactionDetailComponent;
let fixture: ComponentFixture<TransactionDetailComponent>;
const formBuilder: FormBuilder = new FormBuilder();
// let transactionsFacadeServiceStub: TransactionsFacadeService;
let transactionsFacadeServiceStub: TransactionsFacadeServiceStub;
let activatedRouteStub: ActivatedRouteStub;

const declarations = [
  TransactionDetailComponent,
  CommonWithAnimationComponent
];
const imports = [
  AngularFireModule.initializeApp(environment.firebase, 'home-budget'),
  AngularFireDatabaseModule,
  AngularFireAuthModule,
  AuthenticationStoreModule,
  EffectsModule.forRoot(),
  StoreModule.forRoot({}),
  SharedModule,

  ReactiveFormsModule,
  BrowserAnimationsModule,

  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useClass: TranslateFakeLoader
    }
  }),
];
const providers = [
  TranslateService,
  { provide: FormBuilder, useValue: formBuilder },
  { provide: Router, useValue: mockRouter },
  { provide: AuthenticationHttpService, useClass: AuthenticationServiceStub },
  // { provide: TransactionsFacadeService, useClass: TransactionsFacadeServiceStub },
  { provide: ActivatedRoute, useValue: activatedRouteStub },
  { provide: TransactionsFacadeService, useValue: transactionsFacadeServiceStub },
]

function createForm(): FormGroup {
  return formBuilder.group({
    amount: [null, [Validators.required]],
    category: [null, [Validators.required]],
    date: [null, [Validators.required]],
    recipient: [null, [Validators.required]],
    type: [null, [Validators.required]],
    notes: [''],
  });
}

fdescribe('TransactionDetailComponent', () => {
  beforeEach(() => {
    activatedRouteStub = new ActivatedRouteStub();
    transactionsFacadeServiceStub = new TransactionsFacadeServiceStub();
  });

  describe('when ngOnInit', whenNgOnInitWithUpdateMode);
  describe('when ngOnInit', whenNgOnInitWithUpdateModeAndNoParamKey);
  describe('when ngOnInit', whenNgOnInitWithCreateMode);
  describe('when deleteTransaction', whenDeleteTransaction);
  describe('when saveData', whenSaveDataWithUpdateMode);
  describe('when saveData', whenSaveDataWithCreateMode);
});

function whenNgOnInitWithUpdateMode() {
  beforeEach(() => activatedRouteStub.setParams({ key: '123' }));
  beforeEach(() => transactionsFacadeServiceStub.setTransaction(transaction));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: declarations,
      imports: imports,
      providers: [
        ...providers,
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: TransactionsFacadeService, useValue: transactionsFacadeServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionDetailComponent);
    component = fixture.componentInstance;
    transactionsFacadeServiceStub = TestBed.get(TransactionsFacadeService);
    activatedRouteStub = TestBed.get(ActivatedRoute);
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

  it(`should call 'createForm' method on init`, () => {
    const createFormSpy = spyOn(component, 'createForm');
    component.ngOnInit();
    expect(createFormSpy).toHaveBeenCalled();
  });

  it(`should call 'prepareDataOnUpdate' method on init when params exits`, () => {
    component.ngOnInit();
    expect(component.mode).toBe('update');
    expect(component.sectionTitle).toEqual('EditExpense');
    expect(component.transactionKey).toEqual('123');
  });

  it(`should set form data`, () => {
    component.ngOnInit();
    expect(component.amountControl.value).toEqual(transaction.amount);
    expect(component.dateControl.value).toEqual(transaction.date);
    expect(component.recipientControl.value).toEqual(transaction.recipient);
    expect(component.notesControl.value).toEqual(undefined);
    expect(component.typeControl.value).toEqual(transaction.type);

    component.categories$.subscribe(() => {
      expect(component.categoryControl.value).toEqual({ name: transaction.category });
    });
  });
}

function whenNgOnInitWithUpdateModeAndNoParamKey() {
  beforeEach(() => activatedRouteStub.setParams({ key: '123' }));
  beforeEach(() => transactionsFacadeServiceStub.setTransaction(null));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: declarations,
      imports: imports,
      providers: [
        ...providers,
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: TransactionsFacadeService, useValue: transactionsFacadeServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionDetailComponent);
    component = fixture.componentInstance;
    transactionsFacadeServiceStub = TestBed.get(TransactionsFacadeService);
    activatedRouteStub = TestBed.get(ActivatedRoute);
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

  it(`should navigate to './transactions' when no key param and transaction object is null`, () => {
    component.ngOnInit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['./transactions']);
  });
}

function whenNgOnInitWithCreateMode() {
  beforeEach(() => {
    activatedRouteStub.setParams({ key: 'create' });
    activatedRouteStub.setQueryParams({ type: 'expense' });
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: declarations,
      imports: imports,
      providers: [
        ...providers,
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionDetailComponent);
    component = fixture.componentInstance;
    transactionsFacadeServiceStub = TestBed.get(TransactionsFacadeService);
    activatedRouteStub = TestBed.get(ActivatedRoute);
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

  it(`should call 'prepareDataOnCreate' method on init when params not exits`, () => {
    component.ngOnInit();
    expect(component.mode).toBe('create');
    expect(component.sectionTitle).toEqual('NewExpense');
  });
}

function whenDeleteTransaction() {
  beforeEach(() => activatedRouteStub.setParams({ key: '123' }));
  beforeEach(() => transactionsFacadeServiceStub.setIsSuccess(true));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: declarations,
      imports: imports,
      providers: [
        ...providers,
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: TransactionsFacadeService, useValue: transactionsFacadeServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionDetailComponent);
    component = fixture.componentInstance;
    transactionsFacadeServiceStub = TestBed.get(TransactionsFacadeService);
    activatedRouteStub = TestBed.get(ActivatedRoute);
    component.transactionForm = createForm();
    fixture.detectChanges();
  });

  it(`should call 'deleteTransaction' method on transactionsService when 'deleteItem' called`, () => {
    const deleteItemSpy = spyOn(transactionsFacadeServiceStub, 'deleteTransaction');
    component.deleteItem();
    expect(deleteItemSpy).toHaveBeenCalled();
  });

  it(`should navigate to './transactions' when delete succeeded`, () => {
    spyOn(transactionsFacadeServiceStub, 'deleteTransaction');
    component.deleteItem();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['./transactions']);
  });
}

function whenSaveDataWithUpdateMode() {
  beforeEach(() => activatedRouteStub.setParams({ key: '123' }));
  beforeEach(() => transactionsFacadeServiceStub.setIsSuccess(true));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: declarations,
      imports: imports,
      providers: [
        ...providers,
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: TransactionsFacadeService, useValue: transactionsFacadeServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionDetailComponent);
    component = fixture.componentInstance;
    transactionsFacadeServiceStub = TestBed.get(TransactionsFacadeService);
    activatedRouteStub = TestBed.get(ActivatedRoute);
    component.transactionForm = createForm();
    fixture.detectChanges();
  });

  it(`should call 'updateTransaction' method on transactionsService when 'saveData' called and 'mode = update'`, () => {
    const updateTransactionSpy = spyOn(transactionsFacadeServiceStub, 'updateTransaction');
    component.saveData(component.transactionForm);
    expect(updateTransactionSpy).toHaveBeenCalled();
  });

  it(`should navigate to './transactions' when save succeeded`, () => {
    spyOn(transactionsFacadeServiceStub, 'createTransaction');
    component.saveData(component.transactionForm);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['./transactions']);
  });
}

function whenSaveDataWithCreateMode() {
  beforeEach(() => activatedRouteStub.setParams({ key: 'create' }));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: declarations,
      imports: imports,
      providers: [
        ...providers,
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: TransactionsFacadeService, useValue: transactionsFacadeServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionDetailComponent);
    component = fixture.componentInstance;
    transactionsFacadeServiceStub = TestBed.get(TransactionsFacadeService);
    activatedRouteStub = TestBed.get(ActivatedRoute);
    component.transactionForm = createForm();
    fixture.detectChanges();
  });

  it(`should call 'createTransaction' method on transactionsService when 'saveData' called and 'mode = create'`, () => {
    const createTransactionSpy = spyOn(transactionsFacadeServiceStub, 'createTransaction');
    component.saveData(component.transactionForm);
    expect(createTransactionSpy).toHaveBeenCalled();
  });
}
