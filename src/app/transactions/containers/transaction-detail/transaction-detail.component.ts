import { Component, OnInit } from '@angular/core';
import { CommonWithAnimationComponent } from '@shared/components';
import { combineLatest, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { budgetCategories } from '@transactions/models/budget-categories.data';

@Component({
  selector: 'hb-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss']
})
export class TransactionDetailComponent extends CommonWithAnimationComponent implements OnInit {

  mode: 'create' | 'update';
  sectionTitle: string;
  type: string;

  transactionForm: FormGroup;

  categories$ = of(budgetCategories);
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
  ) {
    super();
  }

  get typeControl() { return this.transactionForm.get('type'); }

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
    console.log(event.value);
  }
}
