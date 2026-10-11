import { Injectable, inject } from '@angular/core';
import { BreadcrumbsItem, DataEntry, DataLabels, DataSourceDetails, DataSourceSummary, FinanceConfig, FinanceEntry } from '@home-budget/finance/models';
import { Observable } from 'rxjs';
import { formData, formProjectTotal } from './finance-summary-former.utils';
import { FinanceBreadcrumbsService } from './finance-breadcrumbs.service';
import { FinanceService } from './finance.service';

@Injectable()
export class FinanceFacadeService {

  private readonly financeBreadcrumbsService = inject(FinanceBreadcrumbsService);
  private readonly financeService = inject(FinanceService);

  get dataLabels(): DataLabels {
    return this.financeService.dataLabels;
  }

  get dataSource(): DataSourceDetails[] {
    return this.financeService.dataSource;
  }

  get dataSourceFooter(): DataSourceDetails {
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

  get breadcrumbs(): BreadcrumbsItem[] {
    return this.financeBreadcrumbsService.breadcrumbs;
  }

  formData(data: DataEntry[], financeConfig: FinanceConfig): DataSourceSummary[] {
    return formData(data, financeConfig);
  }

  formProjectTotal(data: DataEntry[], financeConfig: FinanceConfig): number {
    return formProjectTotal(data, financeConfig);
  }

  setCommonDataLabels() {
    this.financeService.setCommonDataLabels();
  }

  readData(path: string, uid?: string): Observable<DataEntry[]> {
    return this.financeService.readData(path, uid);
  }

  addFinanceEntryColumn(): void {
    this.financeService.addFinanceEntryColumn();
  }

  resetBreadcrumbs(): void {
    this.financeBreadcrumbsService.resetBreadcrumbs();
  }

  formBreadcrumbs(financeEntry: FinanceEntry, dataLabels: DataLabels): void {
    this.financeBreadcrumbsService.formBreadcrumbs(financeEntry, dataLabels);
  }

  editFinanceEntry(event: FinanceEntry): void {
    this.financeService.editFinanceEntry(event);
  }

  goToDetails(financeEntry: FinanceEntry): void {
    this.financeService.goToDetails(financeEntry);
  }

}
