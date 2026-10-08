import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, startWith, shareReplay } from 'rxjs/operators';

const YEAR_PATTERN = /^\d{4}$/;

function defaultYear(): string {
  return new Date().getFullYear().toString();
}

@Injectable()
export class CoreService {
  private readonly router = inject(Router);

  year$: Observable<string> = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    startWith(null),
    map(() => this.extractYear(this.router.url)),
    distinctUntilChanged(),
    shareReplay(1),
  );

  get year(): string {
    return this.extractYear(this.router.url);
  }

  private extractYear(url: string): string {
    const firstSegment = url.split('?')[0].split('/').filter(Boolean)[0];
    return YEAR_PATTERN.test(firstSegment) ? firstSegment : defaultYear();
  }
}
