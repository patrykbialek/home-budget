import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export class CoreServiceConfig {
  year = '2023';
}

@Injectable()
export class CoreService  {
  private yearSource = new BehaviorSubject(localStorage.getItem('year') || '2023');
  year$ = this.yearSource.asObservable();

  setYear(year: string) {
    this.yearSource.next(year);
    localStorage.setItem('year', year);
  }
}
