// export for convenience.
export { ActivatedRoute } from '@angular/router';

import { convertToParamMap, ParamMap, Params } from '@angular/router';
import { ReplaySubject, Observable, of } from 'rxjs';

/**
 * An ActivateRoute test double with a `paramMap` observable.
 * Use the `setParamMap()` method to add the next `paramMap` value.
 */
export class ActivatedRouteStub {
  // Use a ReplaySubject to share previous values with subscribers
  // and pump new values into the `paramMap` observable
  private paramMapSubject = new ReplaySubject<ParamMap>();
  private paramsSubject = new ReplaySubject<Params>();
  private queryParamsSubject = new ReplaySubject<Params>();

  constructor(initialParams?: Params) {
    this.setParamMap(initialParams);
    this.setParams(initialParams);
    this.setQueryParams(initialParams);
  }

  readonly paramMap = this.paramMapSubject.asObservable();
  readonly params = this.paramsSubject.asObservable();
  readonly queryParams = this.queryParamsSubject.asObservable();

  setParamMap(params?: Params) {
    this.paramMapSubject.next(convertToParamMap(params));
  }

  setParams(params?: Params) {
    this.paramsSubject.next(params);
  }

  setQueryParams(params?: Params) {
    this.queryParamsSubject.next(params);
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
