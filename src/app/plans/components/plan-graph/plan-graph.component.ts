import { Component, Input, OnInit } from '@angular/core';

import * as config from '../../shared/plans.config';
import * as fromModels from '@home-budget/plans/models';

const planChartOption: Partial<fromModels.PlanGraphConfig> = {
  backgroundColor: config.chartOption.color.transparent,
  label: '',
  pointHoverRadius: 7,
  pointRadius: 1,
  pointStyle: 'circle',
};

@Component({
  selector: 'hb-plan-graph',
  templateUrl: './plan-graph.component.html',
  styleUrls: ['./plan-graph.component.scss']
})
export class PlanGraphComponent implements OnInit {

  public chartLabels: Array<string>;
  public chartType: string = 'line';
  public data: any;
  public incomesExpensesDatasets: Array<Partial<fromModels.PlanGraphConfig>> = [];
  public incomesExpensesOptions: any;
  public increaseDatasets: Array<Partial<fromModels.PlanGraphConfig>> = [];
  public increaseOptions: any;

  @Input() public readonly dataSource: any[];

  public ngOnInit(): void {
    this.data = {
      expenses: this.dataSource.map((data: any) => data.expenses),
      incomes: this.dataSource.map((data: any) => data.incomes),
      increase: this.dataSource.map((data: any) => data.increase),
    };
    this.chartLabels = Object.keys(config.monthLabel)
      .map((key: string) => config.monthLabel[key].short);
    this.setGraphData();
  }

  private setGraphData(): void {
    this.setIncreaseData();
    this.setIncomesExpensesData();
  }

  private setIncreaseData(): void {
    this.increaseOptions = {
      responsive: true,
      defaultFontFamily: 'Nunito Sans',
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Przyrost',
        fontFamily: 'Nunito Sans',
      },
      scales: {
        yAxes: [{
          ticks: {
            min: 0,
          },
          fontFamily: 'Nunito Sans',
        }],
        xAxes: [{
          fontFamily: 'Nunito Sans',
        }]
      }
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
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Przychody i wydatki',
        fontFamily: 'Nunito Sans',
      },
      scales: {
        yAxes: [{
          ticks: {
            min: 10000,
          }
        }]
      }
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
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  };

}
