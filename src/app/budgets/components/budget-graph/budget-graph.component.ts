import { Component, OnInit, input } from '@angular/core';
import { ChartOptions } from 'chart.js';

import * as config from '../../shared/budgets.config';
import * as fromModels from '@budgets/models';

const planChartOption: Partial<fromModels.PlanGraphConfig> = {
  backgroundColor: config.chartOption.color.transparent,
  label: '',
  pointHoverRadius: 7,
  pointRadius: 1,
  pointStyle: 'circle',
  tension: 0.4,
};


interface GraphData {
  expenses: number[];
  incomes: number[];
  increase: number[];
}
@Component({
  selector: 'hb-budget-graph',
  templateUrl: './budget-graph.component.html',
  styleUrls: ['./budget-graph.component.scss'],
  standalone: false
})
export class BudgetGraphComponent implements OnInit {
  chartLabels: Array<string> = [];
  chartType: string = 'line';
  data: GraphData | undefined;
  incomesExpensesDatasets: Array<Partial<fromModels.PlanGraphConfig>> = [];
  incomesExpensesOptions: ChartOptions | undefined;
  increaseDatasets: Array<Partial<fromModels.PlanGraphConfig>> = [];
  increaseOptions: ChartOptions | undefined;

  dataSource = input.required<fromModels.DataSourceSummary[]>();

  ngOnInit(): void {
    this.data = {
      expenses: this.dataSource().map((data: fromModels.DataSourceSummary) => data.expense),
      incomes: this.dataSource().map((data: fromModels.DataSourceSummary) => data.income),
      increase: this.dataSource().map((data: fromModels.DataSourceSummary) => data.increase),
    };
    this.chartLabels = Object.keys(config.monthLabel)
      .map((key: string) => config.monthLabel[key as keyof fromModels.MonthLabel].short ?? '');
    this.setGraphData();
  }

  private setGraphData(): void {
    this.setIncreaseData();
    this.setIncomesExpensesData();
  }

  private setIncreaseData(): void {
    this.increaseOptions = {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Przyrost' },
      },
      scales: {
        y: { min: 0 },
      },
    };
    this.increaseDatasets = [
      {
        ...planChartOption,
        borderColor: config.chartOption.color.blue,
        data: this.data.increase,
        pointBackgroundColor: config.chartOption.color.blue,
        pointBorderColor: config.chartOption.color.blue,
      },
    ];
  }

  private setIncomesExpensesData(): void {
    this.incomesExpensesOptions = {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Przychody i wydatki' },
      },
      scales: {
        y: { min: 10000 },
      },
    };
    this.incomesExpensesDatasets = [
      {
        ...planChartOption,
        borderColor: config.chartOption.color.green,
        data: this.data.incomes,
        pointBackgroundColor: config.chartOption.color.green,
        pointBorderColor: config.chartOption.color.green,
      },
      {
        ...planChartOption,
        borderColor: config.chartOption.color.red,
        data: this.data.expenses,
        pointBackgroundColor: config.chartOption.color.red,
        pointBorderColor: config.chartOption.color.red,
      },
    ];
  }

  // events
  chartClicked(e: unknown): void {
  }

  chartHovered(e: unknown): void {
  }

}
