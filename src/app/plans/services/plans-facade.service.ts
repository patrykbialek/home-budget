import { Injectable, inject } from '@angular/core';
import * as fromModels from '@home-budget/plans/models';
import { Observable } from 'rxjs';
import { formData } from './plan-summary-former.utils';
import { PlansBreadcrumbsService } from './plans-breadcrumbs.service';
import { PlansService } from './plans.service';

@Injectable({ providedIn: 'root' })
export class PlansFacadeService {

  private readonly plansBreadcrumbsService = inject(PlansBreadcrumbsService);
  private readonly plansService = inject(PlansService);

  get dataLabels(): fromModels.DataLabels {
    return this.plansService.dataLabels;
  }

  get dataSource(): fromModels.DataSourceDetails[] {
    return this.plansService.dataSource;
  }

  get dataSourceFooter(): fromModels.DataSourceDetails {
    return this.plansService.dataSourceFooter;
  }

  get dataColumns(): string[] {
    return this.plansService.dataColumns;
  }

  get displayedColumns(): string[] {
    return this.plansService.displayedColumns;
  }

  get isLoading(): boolean {
    return this.plansService.isLoading;
  }

  get breadcrumbs(): fromModels.BreadcrumbsItem[] {
    return this.plansBreadcrumbsService.breadcrumbs;
  }

  formData(data: fromModels.DataEntry[], planConfig: fromModels.PlanConfig): fromModels.DataSourceSummary[] {
    return formData(data, planConfig);
  }

  setCommonDataLables() {
    this.plansService.setCommonDataLables();
  }

  readData(path: string): Observable<fromModels.DataEntry[]> {
    return this.plansService.readData(path);
  }

  addPlanEntryColumn(): void {
    this.plansService.addPlanEntryColumn();
  }

  resetBreadcrumbs(): void {
    this.plansBreadcrumbsService.resetBreadcrumbs();
  }

  formBreadcrumbs(planEntry: fromModels.PlanEntry, dataLabels: fromModels.DataLabels): void {
    this.plansBreadcrumbsService.formBreadcrumbs(planEntry, dataLabels);
  }

  editPlanEntry(event: fromModels.PlanEntry): void {
    this.plansService.editPlanEntry(event);
  }

  goToDetails(planEntry: fromModels.PlanEntry): void {
    this.plansService.goToDetails(planEntry);
  }

}
