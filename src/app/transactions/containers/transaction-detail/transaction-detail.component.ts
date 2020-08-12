import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationHttpService } from '@home-budget/authentication/services';
import { CommonWithAnimationComponent } from '@home-budget/shared/components';
import { SharedUtilsService } from '@home-budget/shared/services/shared-utils.service';
import * as fromModels from '@home-budget/transactions/models';
import { budgetCategories } from '@home-budget/transactions/models/budget-categories.data';
import { TransactionsFacadeService } from '@home-budget/transactions/store';
import { combineLatest, of, Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';

export enum Mode {
  Create = 'create',
  Update = 'update',
}

@Component({
  selector: 'hb-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss']
})
export class TransactionDetailComponent
  extends CommonWithAnimationComponent
  implements OnDestroy, OnInit {

  mode: Mode;
  sectionTitle: string;
  transactionKey: string;
  type: string;
  uid: string;

  transactionForm: FormGroup;

  categories$ = of(budgetCategories);
  windowSize$ = this.sharedUtilsService.windowSize$;

  private subscription$ = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationHttpService,
    private formBuilder: FormBuilder,
    private router: Router,
    private sharedUtilsService: SharedUtilsService,
    private transactionsService: TransactionsFacadeService,
  ) {
    super();
  }

  get amountControl() { return this.transactionForm.get('amount'); }
  get categoryControl() { return this.transactionForm.get('category'); }
  get dateControl() { return this.transactionForm.get('date'); }
  get notesControl() { return this.transactionForm.get('notes'); }
  get recipientControl() { return this.transactionForm.get('recipient'); }
  get typeControl() { return this.transactionForm.get('type'); }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

  ngOnInit() {
    this.createForm();

    const params$ = this.activatedRoute.params;
    const queryParams$ = this.activatedRoute.queryParams;
    const authState$ = this.authenticationService.authState$;

    this.subscription$.add(
      combineLatest([params$, queryParams$, authState$])
        .pipe(
          tap(([params, queryParams, authState]) => {
            this.uid = authState.uid;
            this.mode = params.key === Mode.Create
              ? Mode.Create
              : Mode.Update;
            this.mode === Mode.Create
              ? this.prepareDataOnCreate(queryParams)
              : this.prepareDataOnUpdate(params);

          })
        ).subscribe()
    );
  }

  createForm() {
    this.transactionForm = this.formBuilder.group({
      amount: [null, [Validators.required]],
      category: [null, [Validators.required]],
      date: [null, [Validators.required]],
      recipient: [null, [Validators.required]],
      type: [null, [Validators.required]],
      notes: [''],
    });
  }

  deleteItem() {
    const payload: fromModels.TransactionPayload = {
      key: this.transactionKey,
      value: null,
      uid: this.uid,
    };
    this.transactionsService.deleteTransactionFromDetail(payload);

    this.transactionsService.isSuccess$
      .pipe(
        take(1),
        tap((response: boolean) => {
          if (response) {
            this.router.navigate(['./transactions']);
          }
        }),
      ).subscribe();
  }

  saveData(event: FormGroup) {
    const payload: fromModels.TransactionPayload = {
      key: this.transactionKey,
      value: event.value,
      uid: this.uid,
    };

    this.mode === 'create'
      ? this.transactionsService.createTransaction(payload)
      : this.transactionsService.updateTransaction(payload);

    this.transactionsService.isSuccess$
      .pipe(
        take(1),
        tap((response: boolean) => {
          if (response) {
            this.router.navigate(['./transactions']);
          }
        }),
      ).subscribe();
  }

  private fillFormData(transaction: fromModels.Transaction) {
    this.amountControl.setValue(Math.abs(transaction.amount));
    this.dateControl.setValue(new Date(transaction.date));
    this.recipientControl.setValue(transaction.recipient);
    this.notesControl.setValue(transaction.notes);
    this.typeControl.setValue(transaction.type);

    this.categories$ = this.categories$
      .pipe(
        tap(categories => {
          const category = categories.find(cat => cat.name === transaction.category);
          this.categoryControl.setValue(category);
        }),
      );
  }

  private getTransactionTypeLabel(type: fromModels.TransactionType): string {
    return type === fromModels.TransactionType.Expense
      ? 'Expense'
      : 'Income';
  }

  private prepareDataOnCreate(queryParams: { [key: string]: any; }): void {
    const transactionType = queryParams ? queryParams.type : null;
    const transactionTypeLabel = this.getTransactionTypeLabel(transactionType);
    this.setSectionTitle(transactionTypeLabel);
    this.typeControl.setValue(transactionType);
    this.dateControl.setValue(new Date());
  }

  private prepareDataOnUpdate(params: { [key: string]: any; }): void {
    this.transactionsService.transaction$
      .pipe(
        tap((response: fromModels.Transaction) => {
          if (response) {
            const transactionTypeLabel = response
              ? this.getTransactionTypeLabel(response.type)
              : null;
            this.setSectionTitle(transactionTypeLabel);
            this.fillFormData(response);
            this.transactionKey = params.key;
          } else {
            this.router.navigate(['./transactions']);
          }
        }),
        take(1),
      ).subscribe();
  }

  private setSectionTitle(type: string): void {
    this.sectionTitle = this.mode === Mode.Create
      ? `New${type}`
      : `Edit${type}`;
  }
}
