import { Action } from '@ngrx/store';

import * as fromModels from '../../models';

// Set
export const SET_USER          = '[App Component] Set user';
export const SET_USER_SUCCESS  = '[AngularFireAuth API] Set user success';
export const SET_USER_FAILURE  = '[AngularFireAuth API] Set user failure';

export class SetUser implements Action {
  readonly type = SET_USER;
  constructor(public payload: { uid: string }, ) { }
}

export class SetUserSuccess implements Action {
  readonly type = SET_USER_SUCCESS;
  constructor(public payload: fromModels.User, ) { }
}

export class SetUserFailure implements Action {
  readonly type = SET_USER_FAILURE;
  constructor(public payload: fromModels.ErrorMessage, ) { }
}

// Login
export const LOGIN_USER          = '[Login Page] Login user';
export const LOGIN_USER_SUCCESS  = '[Auth API] Login user success';
export const LOGIN_USER_FAILURE  = '[Auth API] Login user failure';

export class LoginUser implements Action {
  readonly type = LOGIN_USER;
  constructor(public payload: fromModels.UserLogin, ) { }
}

export class LoginUserSuccess implements Action {
  readonly type = LOGIN_USER_SUCCESS;
  constructor(public payload: fromModels.User, ) { }
}

export class LoginUserFailure implements Action {
  readonly type = LOGIN_USER_FAILURE;
}

// Logout
export const LOGOUT_USER_FROM_CONTAINER  = '[Auth Container] Logout user';
export const LOGOUT_USER_SUCCESS         = '[Auth API] Logout user success';
export const LOGOUT_USER_FAILURE         = '[Auth API] Logout user failure';

export class LogoutUserFromContainer implements Action {
  readonly type = LOGOUT_USER_FROM_CONTAINER;
}

export class LogoutUserSuccess implements Action {
  readonly type = LOGOUT_USER_SUCCESS;
}

export class LogoutUserFailure implements Action {
  readonly type = LOGOUT_USER_FAILURE;
}

// Register
export const REGISTER_USER          = '[Register User Page] Register user';
export const REGISTER_USER_SUCCESS  = '[Auth API] Register user success';
export const REGISTER_USER_FAILURE  = '[Auth API] Register user failure';

export class RegisterUser implements Action {
  readonly type = REGISTER_USER;
  constructor(public payload?: fromModels.UserRegister, ) { }
}

export class RegisterUserSuccess implements Action {
  readonly type = REGISTER_USER_SUCCESS;
  constructor(public payload: fromModels.User, ) { }
}

export class RegisterUserFailure implements Action {
  readonly type = REGISTER_USER_FAILURE;
}

// Reset
export const RESET_PASSWORD          = '[Reset Password Page] Reset password';
export const RESET_PASSWORD_SUCCESS  = '[Auth API] Reset password success';
export const RESET_PASSWORD_FAILURE  = '[Auth API] Reset password failure';

export class ResetPassword implements Action {
  readonly type = RESET_PASSWORD;
  constructor(public payload?: fromModels.PasswordReset, ) { }
}

export class ResetPasswordSuccess implements Action {
  readonly type = RESET_PASSWORD_SUCCESS;
}

export class ResetPasswordFailure implements Action {
  readonly type = RESET_PASSWORD_FAILURE;
}

// Set
export const SET_PASSWORD          = '[Set Password Page] Set password';
export const SET_PASSWORD_SUCCESS  = '[Auth API] Set password success';
export const SET_PASSWORD_FAILURE  = '[Auth API] Set password failure';

export class SetPassword implements Action {
  readonly type = SET_PASSWORD;
  constructor(public payload?: fromModels.PasswordSet, ) { }
}

export class SetPasswordSuccess implements Action {
  readonly type = SET_PASSWORD_SUCCESS;
}

export class SetPasswordFailure implements Action {
  readonly type = SET_PASSWORD_FAILURE;
}

export type AuthenticationAction =
  | SetUser
  | SetUserSuccess
  | SetUserFailure
  | LoginUser
  | LoginUserSuccess
  | LoginUserFailure
  | LogoutUserFromContainer
  | LogoutUserSuccess
  | LogoutUserFailure
  | LoginUser
  | LoginUserSuccess
  | LoginUserFailure
  | RegisterUser
  | RegisterUserSuccess
  | RegisterUserFailure
  | ResetPassword
  | ResetPasswordSuccess
  | ResetPasswordFailure
  | SetPassword
  | SetPasswordSuccess
  | SetPasswordFailure

  ;
