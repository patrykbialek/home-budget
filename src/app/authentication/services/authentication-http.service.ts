import { Injectable } from "@angular/core";

import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
} from '@angular/fire/database';
import { map, delay, tap, switchMap, mergeMap, startWith } from 'rxjs/operators';

import * as moment from 'moment';

import * as fromModels from '../models';
import { of, from } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationHttpService {

  constructor(
    private db: AngularFireDatabase,
    private fireAuth: AngularFireAuth,
  ) {}

  // Register

  registerUser(payload: fromModels.UserPayload) {
    const callback = this.fireAuth
      .auth.createUserWithEmailAndPassword(payload.value.email, payload.value.password)
      .then(response => {
        const uid = response.user.uid;
        const db: AngularFireObject<any> = this.db.object(`/workspaces/${uid}/user`);
        const value = {
          email: payload.value.email,
          name: payload.value.name,
          uid,
        };
        db.set(value);
        return value;
      })
      .catch(error => console.log(error));

    return from(callback);
  }

}