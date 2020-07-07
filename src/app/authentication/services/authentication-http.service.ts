import { Injectable } from "@angular/core";

import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/database';
import { map, delay, tap, switchMap, mergeMap } from 'rxjs/operators';

import * as moment from 'moment';

import * as fromModels from '../models';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationHttpService {

  constructor(
    private db: AngularFireDatabase,
  ) { }

  // Register

  registerUser(payload: fromModels.UserPayload) {
    console.log(payload)
    const db: AngularFireList<any> = this.db.list(`/users`);
    const value = payload.value;
    return of(db.push(value));
  }

}