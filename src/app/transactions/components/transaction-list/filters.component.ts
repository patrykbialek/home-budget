import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import 'moment/locale/pl';
import { of, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as fromModels from '../../models';
import { budgetCategories } from '../../models/budget-categories.data';
import { queryPeriods } from '../../models/query-periods.data';

moment.locale('pl')

@Component({
  selector: 'hb-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnDestroy, OnInit {

  currentMonth: string;
  previousMonth: string;
  currentYear: string;

  filterForm: FormGroup;

  periodValueSuffix: string;
  query: fromModels.Query = {
    category: null,
    periodFrom: null,
    periodTo: null,
  };

  categories$ = of(budgetCategories);
  periods$ = of(queryPeriods);

  private subscription$ = new Subscription();

  @Output() readTransactions = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private translationService: TranslateService,
  ) {
    this.subscription$.add(
      translationService
        .onLangChange
        .subscribe(value => {
          this.setQueryPeriodLabels(value.lang);
          this.setPeriodValueSuffix(this.periodControl.value);
        })
    );
  }

  get categoryControl() { return this.filterForm.get('category'); }
  get periodControl() { return this.filterForm.get('period'); }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

  ngOnInit(): void {
    this.createForm();
    this.setDefaultQueryValues();
    this.setListenerOnCategoryChange();
    this.setListenerOnPeriodChange();
    this.setQueryPeriodLabels(this.translationService.currentLang);
  }

  private createForm() {
    this.filterForm = this.formBuilder.group({
      category: [null],
      period: [null],
    });
  }

  private setDefaultQueryValues() {
    this.categories$ = this.categories$.pipe(
      tap((categories: any[]) => {
        this.categoryControl.setValue(categories[0], { emitEvent: false });
      }),
    );

    this.periods$ = this.periods$.pipe(
      tap((periods: any[]) => {
        this.periodControl.setValue(periods[0]);
      }),
    );
  }

  private setListenerOnCategoryChange() {
    this.categoryControl
      .valueChanges
      .subscribe((value: { name: string }) => {
        this.setQueryCategoryAndReadTransactions(value);
      });
  }

  private setListenerOnPeriodChange() {
    this.periodControl
      .valueChanges
      .subscribe((value: { id: string, name: string }) => {
        this.setPeriodValueSuffix(value);
        this.setQueryPeriodAndReadTransactions(value);
      });
  }

  private setQueryPeriodLabels(currentLang = 'pl') {
    this.currentMonth = moment().locale(currentLang).format('MMMM');
    this.previousMonth = moment().locale(currentLang).subtract(1, 'months').format('MMMM');
    this.currentYear = moment().locale(currentLang).format('YYYY');
  }

  private setQueryCategoryAndReadTransactions(value: { name: string }) {
    value.name !== 'all'
      ? this.query.category = value.name
      : delete this.query.category;

    this.readTransactions.emit(this.query);
  }

  private setQueryPeriodAndReadTransactions(value: { id: string, name: string }) {
    const dateFormat = 'YYYY-MM-DD';
    if (value.id === 'currentMonth') {
      this.query.periodFrom = moment().startOf('month').format(dateFormat);
      this.query.periodTo = moment().endOf('month').format(dateFormat);
    }

    if (value.id === 'previousMonth') {
      this.query.periodFrom = moment().subtract(1, 'months').startOf('month').format(dateFormat);
      this.query.periodTo = moment().subtract(1, 'months').endOf('month').format(dateFormat);
    }

    if (value.id === 'last3Months') {
      this.query.periodFrom = moment().subtract(3, 'months').startOf('month').format(dateFormat);
      this.query.periodTo = moment().subtract(0, 'months').endOf('month').format(dateFormat);
    }

    if (value.id === 'last6Months') {
      this.query.periodFrom = moment().subtract(6, 'months').startOf('month').format(dateFormat);
      this.query.periodTo = moment().subtract(0, 'months').endOf('month').format(dateFormat);
    }

    if (value.id === 'currentYear') {
      this.query.periodFrom = moment().startOf('year').format(dateFormat);
      this.query.periodTo = moment().format(dateFormat);
    }

    this.readTransactions.emit(this.query);
  }

  private setPeriodValueSuffix(value: { id: string, name: string }) {
    this.periodValueSuffix = this[value.id];
  }
}
