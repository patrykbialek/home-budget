import { BehaviorSubject } from 'rxjs';

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PlanService {
  private breadcrumbsSubject$ = new BehaviorSubject<string[]>([]);
  public breadcrumbsState$ = this.breadcrumbsSubject$.asObservable();

  clearBreadcrumbsState(): void {
    this.breadcrumbsSubject$.next([]);
  }

  setBreadcrumbsState(breadcrumbs: string[]): void {
    this.breadcrumbsSubject$.next(breadcrumbs);
  }
}
