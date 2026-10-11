import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { WindowSize } from '@home-budget/shared/models';

@Injectable({
  providedIn: 'root',
})
export class SharedUtilsService  {
  private resizeSource = new BehaviorSubject(WindowSize.Desktop);
  windowSize$ = this.resizeSource.asObservable();

  setIsMobileSize(size: WindowSize) {
    this.resizeSource.next(size);
  }
}
