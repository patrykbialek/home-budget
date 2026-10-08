import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

const YEAR_PATTERN = /^\d{4}$/;

@Injectable({
  providedIn: 'root',
})
export class YearGuard {
  private readonly router = inject(Router);

  canActivate(next: ActivatedRouteSnapshot): boolean {
    const year = next.paramMap.get('year');

    if (year && YEAR_PATTERN.test(year)) {
      return true;
    }

    this.router.navigate(['/', new Date().getFullYear().toString(), 'plans', 'execution']);
    return false;
  }
}
