import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonWithAnimationComponent } from '@shared/components';
import { budgetCategories } from '@transactions/models/budget-categories.data';
import { TransactionsFacadeService } from '@transactions/store';
import { combineLatest, of, Subscription } from 'rxjs';
import { tap, take } from 'rxjs/operators';
import * as fromModels from '../../models';

@Component({
  selector: 'hb-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss']
})
export class TransactionDetailComponent extends CommonWithAnimationComponent implements OnDestroy, OnInit {

  mode: 'create' | 'update';
  sectionTitle: string;
  transactionKey: string;
  type: string;

  transactionForm: FormGroup;

  categories$ = of(budgetCategories);

  private subscription$ = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
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

    combineLatest([params$, queryParams$])
      .pipe(
        tap(([params, queryParams]) => {
          this.mode = params.key === 'create' ? 'create' : 'update';
          let type;

          if (this.mode === 'create') {
            this.typeControl.setValue(queryParams.type);
            type = queryParams.type === 'expense' ? 'wydatek' : 'przychód';
            this.dateControl.setValue(new Date());
          } else {
            this.transactionsService.transaction$
              .pipe(
                tap(response => {
                  this.fillFormData(response);
                  type = response.type === 'expense' ? 'wydatek' : 'przychód';
                  this.transactionKey = params.key;
                }),
                take(1),
              ).subscribe();
          }

          this.sectionTitle = this.mode === 'create' ? `Nowy ${type}` : `Edytuj ${type}`;
        })
      ).subscribe();
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

  saveData(event: FormGroup) {
    const payload: fromModels.TransactionPayload = {
      key: this.transactionKey,
      value: event.value
    };

    this.mode === 'create'
      ? this.transactionsService.createTransaction(payload)
      : this.transactionsService.updateTransaction(payload);

    this.transactionsService.isSuccess$
      .pipe(
        take(1),
        tap(response => {
          if (response) {
            this.router.navigate(['./transactions']);
          }
        }),
      ).subscribe();
  }

  fillFormData(transaction: fromModels.Transaction) {
    this.amountControl.setValue(transaction.amount);
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

    // Object.keys(response).forEach((item) => {
    //   const abstractControl = this.transactionForm.controls[item];

    //   if (abstractControl && !(abstractControl instanceof FormArray)) {
    //     if (abstractControl instanceof FormGroup) {
    //       if (response[item] instanceof Object) {
    //         Object.keys(response[item]).forEach((child) => {
    //           this.transactionForm.get(`${item}.${child}`).setValue(response[item][child]);
    //         });
    //       }
    //     } else {
    //       this.transactionForm.get(item).setValue(response[item]);
    //     }
    //   }
    // });
  }
}
