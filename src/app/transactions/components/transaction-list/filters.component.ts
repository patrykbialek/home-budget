import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { of } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { tap } from 'rxjs/operators';

import * as moment from 'moment'
import 'moment/locale/pl'  // without this line it didn't work
moment.locale('pl')

import * as fromModels from '../../models';
import { budgetCategories } from '../../models/budget-categories.data';
import { queryPeriods } from '../../models/query-periods.data';

@Component({
  selector: 'hb-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {

  currentMonth = moment().format('MMMM');
  previousMonth = moment().subtract(1, 'months').format('MMMM');
  currentYear = moment().format('YYYY')

  categories$ = of(budgetCategories);
  periods$ = of(queryPeriods);

  filterForm: FormGroup;

  query: fromModels.Query = {
    category: null,
    periodFrom: null,
    periodTo: null,
  };

  @Output() readTransactions = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  get categoryControl() { return this.filterForm.get('category'); }
  get periodControl() { return this.filterForm.get('period'); }

  ngOnInit(): void {
    this.filterForm = this.formBuilder.group({
      category: [null],
      period: [null],
    });

    this.setDefaultQueryValues();
    this.setListenerOnCategoryChange();
    this.setListenerOnPeriodChange();
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
      .subscribe((value: any) => {
        if (value.name !== 'all') {
          this.query.category = value.name;
        } else {
          delete this.query.category;
        }
        this.readTransactions.emit(this.query);
      });
  }

  private setListenerOnPeriodChange() {
    this.periodControl
      .valueChanges
      .subscribe((value: any) => {

        if (value.id === 'currentMonth') {
          this.query.periodFrom = moment().startOf('month').format('YYYY-MM-DD');
          this.query.periodTo = moment().endOf('month').format('YYYY-MM-DD');
        }

        if (value.id === 'previousMonth') {
          this.query.periodFrom = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
          this.query.periodTo = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
        }

        if (value.id === 'last3Months') {
          this.query.periodFrom = moment().subtract(3, 'months').startOf('month').format('YYYY-MM-DD');
          this.query.periodTo = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
        }

        if (value.id === 'last6Months') {
          this.query.periodFrom = moment().subtract(6, 'months').startOf('month').format('YYYY-MM-DD');
          this.query.periodTo = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
        }

        if (value.id === 'currentYear') {
          this.query.periodFrom = moment().startOf('year').format('YYYY-MM-DD');
          this.query.periodTo = moment().format('YYYY-MM-DD');
        }

        this.readTransactions.emit(this.query);
      });
  }
}
