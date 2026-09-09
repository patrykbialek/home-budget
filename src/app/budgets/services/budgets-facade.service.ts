import { Injectable, inject } from '@angular/core';
import * as fromModels from '@budgets/models';
import { Observable } from 'rxjs';
import { formData, formProjectTotal } from './budget-summary-former.utils';
import { BudgetsBreadcrumbsService } from './budgets-breadcrumbs.service';
import { BudgetsService } from './budgets.service';

@Injectable({ providedIn: 'root' })
export class BudgetsFacadeService {

  private readonly budgetsBreadcrumbsService = inject(BudgetsBreadcrumbsService);
  private readonly budgetsService = inject(BudgetsService);

  get dataLabels(): fromModels.DataLabels {
    return this.budgetsService.dataLabels;
  }

  get dataSource(): fromModels.DataSourceDetails[] {
    return this.budgetsService.dataSource;
  }

  get dataSourceFooter(): fromModels.DataSourceDetails {
    return this.budgetsService.dataSourceFooter;
  }

  get dataColumns(): string[] {
    return this.budgetsService.dataColumns;
  }

  get displayedColumns(): string[] {
    return this.budgetsService.displayedColumns;
  }

  get isLoading(): boolean {
    return this.budgetsService.isLoading;
  }

  get breadcrumbs(): fromModels.BreadcrumbsItem[] {
    return this.budgetsBreadcrumbsService.breadcrumbs;
  }

  formData(data: fromModels.DataEntry[], planConfig: fromModels.PlanConfig): fromModels.DataSourceSummary[] {
    return formData(data, planConfig);
  }

  formProjectTotal(data: fromModels.DataEntry[], planConfig: fromModels.PlanConfig): number {
    return formProjectTotal(data, planConfig);
  }

  setCommonDataLables() {
    this.budgetsService.setCommonDataLables();
  }

  readData(path: string, uid?: string): Observable<fromModels.DataEntry[]> {
    return this.budgetsService.readData(path, uid);
  }

  addPlanEntryColumn(): void {
    this.budgetsService.addPlanEntryColumn();
  }

  resetBreadcrumbs(): void {
    this.budgetsBreadcrumbsService.resetBreadcrumbs();
  }

  formBreadcrumbs(planEntry: fromModels.PlanEntry, dataLabels: fromModels.DataLabels): void {
    this.budgetsBreadcrumbsService.formBreadcrumbs(planEntry, dataLabels);
  }

  editPlanEntry(event: fromModels.PlanEntry): void {
    this.budgetsService.editPlanEntry(event);
  }

  goToDetails(planEntry: fromModels.PlanEntry): void {
    this.budgetsService.goToDetails(planEntry);
  }

}
