import { Injectable, inject } from '@angular/core';
import * as fromModels from '@home-budget/finance/models';
import { Observable } from 'rxjs';
import { formData, formProjectTotal } from './finance-summary-former.utils';
import { FinanceBreadcrumbsService } from './finance-breadcrumbs.service';
import { FinanceService } from './finance.service';

@Injectable()
export class FinanceFacadeService {

  private readonly financeBreadcrumbsService = inject(FinanceBreadcrumbsService);
  private readonly financeService = inject(FinanceService);

  get dataLabels(): fromModels.DataLabels {
    return this.financeService.dataLabels;
  }

  get dataSource(): fromModels.DataSourceDetails[] {
    return this.financeService.dataSource;
  }

  get dataSourceFooter(): fromModels.DataSourceDetails {
    return this.financeService.dataSourceFooter;
  }

  get dataColumns(): string[] {
    return this.financeService.dataColumns;
  }

  get displayedColumns(): string[] {
    return this.financeService.displayedColumns;
  }

  get isLoading(): boolean {
    return this.financeService.isLoading;
  }

  get breadcrumbs(): fromModels.BreadcrumbsItem[] {
    return this.financeBreadcrumbsService.breadcrumbs;
  }

  formData(data: fromModels.DataEntry[], financeConfig: fromModels.FinanceConfig): fromModels.DataSourceSummary[] {
    return formData(data, financeConfig);
  }

  formProjectTotal(data: fromModels.DataEntry[], financeConfig: fromModels.FinanceConfig): number {
    return formProjectTotal(data, financeConfig);
  }

  setCommonDataLabels() {
    this.financeService.setCommonDataLabels();
  }

  readData(path: string, uid?: string): Observable<fromModels.DataEntry[]> {
    return this.financeService.readData(path, uid);
  }

  addFinanceEntryColumn(): void {
    this.financeService.addFinanceEntryColumn();
  }

  resetBreadcrumbs(): void {
    this.financeBreadcrumbsService.resetBreadcrumbs();
  }

  formBreadcrumbs(financeEntry: fromModels.FinanceEntry, dataLabels: fromModels.DataLabels): void {
    this.financeBreadcrumbsService.formBreadcrumbs(financeEntry, dataLabels);
  }

  editFinanceEntry(event: fromModels.FinanceEntry): void {
    this.financeService.editFinanceEntry(event);
  }

  goToDetails(financeEntry: fromModels.FinanceEntry): void {
    this.financeService.goToDetails(financeEntry);
  }

}
