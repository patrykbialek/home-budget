import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const DEFAULT_YEAR = '2023';

export class CoreServiceConfig {
  year = DEFAULT_YEAR;
}

@Injectable()
export class CoreService {
  private yearSource = new BehaviorSubject(localStorage.getItem('year') || DEFAULT_YEAR);
  year$ = this.yearSource.asObservable();

  setYear(year: string) {
    this.yearSource.next(year);
    localStorage.setItem('year', year);
  }
}
