import { Component, OnInit, input } from '@angular/core';

import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';

import { chartOption, monthLabel } from '../../shared/finance.config';
import { DataSourceSummary, FinanceGraphConfig, MonthLabel } from '@home-budget/finance/models';

const financeChartOption: Partial<FinanceGraphConfig> = {
  backgroundColor: chartOption.color.transparent,
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
  selector: 'hb-finance-graph',
  templateUrl: './finance-graph.component.html',
  styleUrls: ['./finance-graph.component.scss'],
  imports: [BaseChartDirective]
})
export class FinanceGraphComponent implements OnInit {
  chartLabels: Array<string> = [];
  chartType: string = 'line';
  data: GraphData | undefined;
  incomesExpensesDatasets: Array<Partial<FinanceGraphConfig>> = [];
  incomesExpensesOptions: ChartOptions | undefined;
  increaseDatasets: Array<Partial<FinanceGraphConfig>> = [];
  increaseOptions: ChartOptions | undefined;

  dataSource = input.required<DataSourceSummary[]>();

  ngOnInit(): void {
    this.data = {
      expenses: this.dataSource().map((data: DataSourceSummary) => data.expense),
      incomes: this.dataSource().map((data: DataSourceSummary) => data.income),
      increase: this.dataSource().map((data: DataSourceSummary) => data.increase),
    };
    this.chartLabels = Object.keys(monthLabel)
      .map((key: string) => monthLabel[key as keyof MonthLabel].short ?? '');
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
        ...financeChartOption,
        borderColor: chartOption.color.blue,
        data: this.data?.increase ?? [],
        pointBackgroundColor: chartOption.color.blue,
        pointBorderColor: chartOption.color.blue,
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
        ...financeChartOption,
        borderColor: chartOption.color.green,
        data: this.data?.incomes ?? [],
        pointBackgroundColor: chartOption.color.green,
        pointBorderColor: chartOption.color.green,
      },
      {
        ...financeChartOption,
        borderColor: chartOption.color.red,
        data: this.data?.expenses ?? [],
        pointBackgroundColor: chartOption.color.red,
        pointBorderColor: chartOption.color.red,
      },
    ];
  }

  chartClicked(e: unknown): void {
  }

  chartHovered(e: unknown): void {
  }

}
