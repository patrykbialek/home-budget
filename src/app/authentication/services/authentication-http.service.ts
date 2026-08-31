import { Injectable, inject } from '@angular/core';
import {
  Auth,
  User,
  UserCredential,
  authState,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from '@angular/fire/auth';
import { Database, objectVal, ref, set } from '@angular/fire/database';
import * as fromModels from '@home-budget/authentication/models';
import { Observable, from, of } from 'rxjs';

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

  readonly authState$: Observable<User | null> = authState(this.fireAuth);

  setUser(payload: fromModels.User) {
    return of(payload);
  }

  loginUser({ email, password }: fromModels.UserLogin) {
    const callback = signInWithEmailAndPassword(this.fireAuth, email, password)
      .then((response: UserCredential) => {
        const user: fromModels.User = response.user;
        return {
          displayName: user.displayName,
          email: user.email,
          uid: user.uid,
        };
      });
    return from(callback);
  }

  logoutUser() {
    return from(signOut(this.fireAuth));
  }

  registerUser({ email, name, password }: fromModels.UserRegister) {
    const callback = createUserWithEmailAndPassword(this.fireAuth, email, password)
      .then(async response => {
        const uid = response.user.uid;
        const value = { email, uid };
        await set(ref(this.db, `/workspaces/${uid}/user`), value);
        await updateProfile(response.user, { displayName: name });
        return value;
      });
    return from(callback);
  }

  resetPassword({ email }: fromModels.PasswordReset) {
    return from(sendPasswordResetEmail(this.fireAuth, email));
  }

  setPassword({ oobCode, newPassword }: fromModels.PasswordSet) {
    return from(confirmPasswordReset(this.fireAuth, oobCode, newPassword));
  }
}
