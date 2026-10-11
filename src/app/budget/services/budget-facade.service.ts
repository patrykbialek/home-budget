import { Injectable, inject } from '@angular/core';
import * as fromModels from '@home-budget/budget/models';
import { Observable } from 'rxjs';
import { formData, formProjectTotal } from './budget-summary-former.utils';
import { BudgetBreadcrumbsService } from './budget-breadcrumbs.service';
import { BudgetService } from './budget.service';

@Injectable()
export class BudgetFacadeService {

  private readonly budgetBreadcrumbsService = inject(BudgetBreadcrumbsService);
  private readonly budgetService = inject(BudgetService);

  get dataLabels(): fromModels.DataLabels {
    return this.budgetService.dataLabels;
  }

  get dataSource(): fromModels.DataSourceDetails[] {
    return this.budgetService.dataSource;
  }

  get dataSourceFooter(): fromModels.DataSourceDetails {
    return this.budgetService.dataSourceFooter;
  }

  get dataColumns(): string[] {
    return this.budgetService.dataColumns;
  }

  get displayedColumns(): string[] {
    return this.budgetService.displayedColumns;
  }

  get isLoading(): boolean {
    return this.budgetService.isLoading;
  }

  get breadcrumbs(): fromModels.BreadcrumbsItem[] {
    return this.budgetBreadcrumbsService.breadcrumbs;
  }

  formData(data: fromModels.DataEntry[], budgetConfig: fromModels.BudgetConfig): fromModels.DataSourceSummary[] {
    return formData(data, budgetConfig);
  }

  formProjectTotal(data: fromModels.DataEntry[], budgetConfig: fromModels.BudgetConfig): number {
    return formProjectTotal(data, budgetConfig);
  }

  setCommonDataLabels() {
    this.budgetService.setCommonDataLabels();
  }

  readData(path: string, uid?: string): Observable<fromModels.DataEntry[]> {
    return this.budgetService.readData(path, uid);
  }

  addBudgetEntryColumn(): void {
    this.budgetService.addBudgetEntryColumn();
  }

  resetBreadcrumbs(): void {
    this.budgetBreadcrumbsService.resetBreadcrumbs();
  }

  formBreadcrumbs(budgetEntry: fromModels.BudgetEntry, dataLabels: fromModels.DataLabels): void {
    this.budgetBreadcrumbsService.formBreadcrumbs(budgetEntry, dataLabels);
  }

  editBudgetEntry(event: fromModels.BudgetEntry): void {
    this.budgetService.editBudgetEntry(event);
  }

  goToDetails(budgetEntry: fromModels.BudgetEntry): void {
    this.budgetService.goToDetails(budgetEntry);
  }

}
