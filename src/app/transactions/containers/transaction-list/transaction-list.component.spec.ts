// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { AngularFireModule } from '@angular/fire';
// import { AngularFireDatabaseModule } from '@angular/fire/database';
// import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { AuthenticationHttpService } from '@authentication/services';
// import { AuthenticationStoreModule } from '@authentication/store/authentication-store.module';
// import { EffectsModule } from '@ngrx/effects';
// import { StoreModule } from '@ngrx/store';
// import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
// import { CommonWithAnimationComponent } from '@shared/components';
// import { SharedModule } from '@shared/shared.module';
// import { TransactionsFacadeService } from '@transactions/store';
// import { AngularFireAuthModule } from 'angularfire2/auth';
// import 'moment/locale/pl';
// import { Observable, of } from 'rxjs';
// import { environment } from 'src/environments/environment';
// import { TransactionListComponent } from './transaction-list.component';

// export class AuthenticationHttpServiceStub {
//   authState$: Observable<any>;

//   constructor() {
//     this.authState$ = of({ uid: '123' });
//   }
// }
// export class TransactionsFacadeServiceStub {
//   isLoading$: Observable<boolean>;
//   total$: Observable<any>;
//   transactions$: Observable<any[]>;

//   constructor() {
//     this.isLoading$ = of(true);
//     this.total$ = of(null);
//     this.transactions$ = of([]);
//   }

//   deleteTransactionFromList(payload: any) {
//     return of(null);
//   }

//   readTransactions(query: any) {
//     return of(null);
//   }
// }

// fdescribe('TransactionListComponent', () => {
//   let component: TransactionListComponent;
//   let fixture: ComponentFixture<TransactionListComponent>;

//   const formBuilder: FormBuilder = new FormBuilder();
//   let transactionsServiceStub: TransactionsFacadeService;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [TransactionListComponent, CommonWithAnimationComponent],
//       imports: [
//         ReactiveFormsModule,
//         AngularFireModule.initializeApp(environment.firebase, 'home-budget'),
//         AngularFireDatabaseModule,
//         AngularFireAuthModule,
//         AuthenticationStoreModule,
//         EffectsModule.forRoot(),
//         StoreModule.forRoot({}),
//         SharedModule,

//         BrowserAnimationsModule,

//         TranslateModule.forRoot({
//           loader: {
//             provide: TranslateLoader,
//             useClass: TranslateFakeLoader
//           }
//         }),
//       ],
//       providers: [
//         TranslateService,
//         { provide: FormBuilder, useValue: formBuilder },
//         { provide: AuthenticationHttpService, useClass: AuthenticationHttpServiceStub },
//         { provide: TransactionsFacadeService, useClass: TransactionsFacadeServiceStub },
//       ],
//     })
//       .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(TransactionListComponent);
//     component = fixture.componentInstance;
//     transactionsServiceStub = TestBed.get(TransactionsFacadeService);
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it(`should call 'deleteTransaction' method in 'transactionService'`, () => {
//     const deleteTransactionSpy = spyOn(transactionsServiceStub, 'deleteTransactionFromList');
//     component.uid = 'test';
//     const key = '123';
//     const payload = { key, value: null, uid: component.uid };
//     component.deleteTransaction(key);
//     expect(deleteTransactionSpy).toHaveBeenCalledWith(payload);
//   });

//   it(`should call 'readTransactions' method if user logged in`, () => {
//     const readTransactionsSpy = spyOn(transactionsServiceStub, 'readTransactions');
//     component.readTransactions({ category: 'one' });
//     expect(readTransactionsSpy).toHaveBeenCalledWith({ uid: '123', query: { category: 'one' }});
//   });
// });
