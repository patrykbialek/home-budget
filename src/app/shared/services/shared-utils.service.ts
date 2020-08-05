import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as fromModels from '../models';

@Injectable({
  providedIn: 'root',
})
export class SharedUtilsService  {
  private resizeSource = new BehaviorSubject(fromModels.WindowSize.Desktop);
  windowSize$ = this.resizeSource.asObservable();

  setIsMobileSize(size: fromModels.WindowSize) {
    this.resizeSource.next(size);
  }
}
