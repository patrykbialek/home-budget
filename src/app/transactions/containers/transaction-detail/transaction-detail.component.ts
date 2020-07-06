import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonWithAnimationComponent } from '@shared/components';
import { budgetCategories } from '@transactions/models/budget-categories.data';
import { TransactionsFacadeService } from '@transactions/store';
import { combineLatest, of, Subscription } from 'rxjs';
import { tap, take } from 'rxjs/operators';

@Component({
  selector: 'hb-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss']
})
export class TransactionDetailComponent extends CommonWithAnimationComponent implements OnDestroy, OnInit {

  mode: 'create' | 'update';
  sectionTitle: string;
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

          const type = queryParams.type === 'expense' ? 'wydatek' : 'przychód';
          this.sectionTitle = this.mode === 'create' ? `Nowy ${type}` : `Edytuj wydatek`;

          this.typeControl.setValue(queryParams.type);
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
      notes: [null],
    });
  }

  saveData(event: FormGroup) {
    this.transactionsService.createTransaction(event.value);

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
}
