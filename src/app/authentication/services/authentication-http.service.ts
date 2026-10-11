import {
  Auth,
  User as FirebaseUser,
  UserCredential,
  authState,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from '@angular/fire/auth';
import { Database, ref, set } from '@angular/fire/database';
import { Injectable, inject } from '@angular/core';

import { Observable, from, of } from 'rxjs';

import { PasswordReset, PasswordSet, User, UserLogin, UserRegister } from '@home-budget/authentication/models';

export interface Credentials {
  email: string | undefined;
  password: string | undefined;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationHttpService {
  private db = inject(Database);
  private fireAuth = inject(Auth);

  readonly authState$: Observable<FirebaseUser | null> = authState(this.fireAuth);

  setUser(payload: User) {
    return of(payload);
  }

  loginUser({ email, password }: UserLogin) {
    const callback = signInWithEmailAndPassword(this.fireAuth, email, password ?? '')
      .then((response: UserCredential) => {
        const user: FirebaseUser = response.user;
        return {
          displayName: user.displayName ?? '',
          email: user.email ?? '',
          uid: user.uid,
        };
      });
    return from(callback);
  }

  logoutUser() {
    return from(signOut(this.fireAuth));
  }

  registerUser({ email, name, password }: UserRegister) {
    const callback = createUserWithEmailAndPassword(this.fireAuth, email, password)
      .then(async response => {
        const uid = response.user.uid;
        const value = { email, uid };
        await set(ref(this.db, `/workspaces/${uid}/user`), value);
        await updateProfile(response.user, { displayName: name });
        return { displayName: name, email, uid };
      });
    return from(callback);
  }

  resetPassword({ email }: PasswordReset) {
    return from(sendPasswordResetEmail(this.fireAuth, email));
  }

  setPassword({ oobCode, newPassword }: PasswordSet) {
    return from(confirmPasswordReset(this.fireAuth, oobCode, newPassword));
  }
}
