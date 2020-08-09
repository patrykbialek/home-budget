import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireObject
} from '@angular/fire/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import * as fromModels from '../models';

export interface Credentials {
  email: string;
  password: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthenticationHttpService {

  readonly authState$: Observable<any | null> = this.fireAuth.authState;

  constructor(
    private db: AngularFireDatabase,
    private fireAuth: AngularFireAuth,
  ) { }


  // Set

  setUser(payload: fromModels.User) {
    return of(payload);
  }

  // Login

  loginUser({ email, password }: fromModels.UserLogin) {
    const callback = this.fireAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then((response: any) => {
        const user: fromModels.User = response.user;
        const value = {
          displayName: user.displayName,
          email: user.email,
          uid: user.uid,
        };
        return value;
      });

    return from(callback);
  }

  // Logout

  logoutUser() {
    const callback = this.fireAuth.auth
      .signOut();

    return from(callback);
  }

  // Register

  registerUser({ email, password }: fromModels.UserRegister) {
    const callback = this.fireAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(response => {
        const uid = response.user.uid;
        const db: AngularFireObject<any> = this.db.object(`/workspaces/${uid}/user`);
        const value = {
          email,
          uid,
        };
        db.set(value);
        return value;
      });

    return from(callback);
  }

  // Reset

  resetPassword({ email }: fromModels.PasswordReset) {
    const callback = this.fireAuth.auth
      .sendPasswordResetEmail(email);

    return from(callback);
  }

  // Set

  setPassword({ oobCode, newPassword }: fromModels.PasswordSet) {
    const callback = this.fireAuth.auth
      .confirmPasswordReset(
        oobCode,
        newPassword,
      )
      .then(response => {
        return response;
      });

    return from(callback);
  }
}
