import { Injectable } from '@angular/core';
import * as fromModels from '@budgets/models';
import { Observable } from 'rxjs';
import { formData } from './plan-summary-former.utils';
import { PlansBreadcrumbsService } from './plans-breadcrumbs.service';
import { PlansService } from './plans.service';

@Injectable({ providedIn: 'root' })
export class PlansFacadeService {

  constructor(
    private readonly plansBreadcrumbsService: PlansBreadcrumbsService,
    private readonly plansService: PlansService,
  ) { }

  public get dataLabels(): any {
    return this.plansService.dataLabels;
  }

  public get dataSource(): fromModels.DataSourceDetails[] {
    return this.plansService.dataSource;
  }

  public get dataSourceFooter(): fromModels.DataSourceDetails {
    return this.plansService.dataSourceFooter;
  }

  public get dataColumns(): string[] {
    return this.plansService.dataColumns;
  }

  public get displayedColumns(): string[] {
    return this.plansService.displayedColumns;
  }

  public get isLoading(): boolean {
    return this.plansService.isLoading;
  }

  public get breadcrumbs(): fromModels.BreadcrumbsItem[] {
    return this.plansBreadcrumbsService.breadcrumbs;
  }

  public formData(data: fromModels.DataEntry[], planConfig: fromModels.PlanConfig): fromModels.DataSourceSummary[] {
    return formData(data, planConfig);
  }

  public setCommonDataLables() {
    this.plansService.setCommonDataLables();
  }

  public readData(path: string): Observable<any> {
    return this.plansService.readData(path);
  }

  public addPlanEntryColumn(): void {
    this.plansService.addPlanEntryColumn();
  }

  public resetBreadcrumbs(): void {
    this.plansBreadcrumbsService.resetBreadcrumbs();
  }

  public formBreadcrumbs(planEntry: fromModels.PlanEntry, dataLabels: fromModels.DataLabels): void {
    this.plansBreadcrumbsService.formBreadcrumbs(planEntry, dataLabels);
  }

  public editPlanEntry(event: fromModels.PlanEntry): void {
    this.plansService.editPlanEntry(event);
  }

  public goToDetails(planEntry: fromModels.PlanEntry): void {
    this.plansService.goToDetails(planEntry);
  }

}
