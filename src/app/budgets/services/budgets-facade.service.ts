import { Injectable } from '@angular/core';
import * as fromModels from '@budgets/models';
import { Observable } from 'rxjs';
import { formData } from './budget-summary-former.utils';
import { BudgetsBreadcrumbsService } from './budgets-breadcrumbs.service';
import { BudgetsService } from './budgets.service';

@Injectable({ providedIn: 'root' })
export class BudgetsFacadeService {

  constructor(
    private readonly budgetsBreadcrumbsService: BudgetsBreadcrumbsService,
    private readonly budgetsService: BudgetsService,
  ) { }

  public get dataLabels(): any {
    return this.budgetsService.dataLabels;
  }

  public get dataSource(): fromModels.DataSourceDetails[] {
    return this.budgetsService.dataSource;
  }

  public get dataSourceFooter(): fromModels.DataSourceDetails {
    return this.budgetsService.dataSourceFooter;
  }

  public get dataColumns(): string[] {
    return this.budgetsService.dataColumns;
  }

  public get displayedColumns(): string[] {
    return this.budgetsService.displayedColumns;
  }

  public get isLoading(): boolean {
    return this.budgetsService.isLoading;
  }

  public get breadcrumbs(): fromModels.BreadcrumbsItem[] {
    return this.budgetsBreadcrumbsService.breadcrumbs;
  }

  public formData(data: fromModels.DataEntry[], planConfig: fromModels.PlanConfig): fromModels.DataSourceSummary[] {
    return formData(data, planConfig);
  }

  public setCommonDataLables() {
    this.budgetsService.setCommonDataLables();
  }

  public readData(path: string): Observable<any> {
    return this.budgetsService.readData(path);
  }

  public addPlanEntryColumn(): void {
    this.budgetsService.addPlanEntryColumn();
  }

  public resetBreadcrumbs(): void {
    this.budgetsBreadcrumbsService.resetBreadcrumbs();
  }

  public formBreadcrumbs(planEntry: fromModels.PlanEntry, dataLabels: fromModels.DataLabels): void {
    this.budgetsBreadcrumbsService.formBreadcrumbs(planEntry, dataLabels);
  }

  public editPlanEntry(event: fromModels.PlanEntry): void {
    this.budgetsService.editPlanEntry(event);
  }

  public goToDetails(planEntry: fromModels.PlanEntry): void {
    this.budgetsService.goToDetails(planEntry);
  }

}
