import { Action } from '@ngrx/store';

import * as fromModels from '../../models';

// Get
export const GET_USER          = '[Main] Get user';
export const GET_USER_SUCCESS  = '[Main] Get user success';
export const GET_USER_FAILURE  = '[Main] Get user failure';

export class GetUser implements Action {
  readonly type = GET_USER;
  constructor(public payload?: any, ) { }
}

export class GetUserSuccess implements Action {
  readonly type = GET_USER_SUCCESS;
  constructor(public payload: any, ) { }
}

export class GetUserFailure implements Action {
  readonly type = GET_USER_FAILURE;
  constructor(public payload: any, ) { }
}

// Login
export const LOGIN_USER          = '[Main] Login user';
export const LOGIN_USER_SUCCESS  = '[Main] Login user success';
export const LOGIN_USER_FAILURE  = '[Main] Login user failure';

export class LoginUser implements Action {
  readonly type = LOGIN_USER;
  constructor(public payload?: any, ) { }
}

export class LoginUserSuccess implements Action {
  readonly type = LOGIN_USER_SUCCESS;
  constructor(public payload: any, ) { }
}

export class LoginUserFailure implements Action {
  readonly type = LOGIN_USER_FAILURE;
  constructor(public payload: any, ) { }
}

// Logout
export const LOGOUT_USER          = '[Main] Logout user';
export const LOGOUT_USER_SUCCESS  = '[Main] Logout user success';
export const LOGOUT_USER_FAILURE  = '[Main] Logout user failure';

export class LogoutUser implements Action {
  readonly type = LOGOUT_USER;
  constructor(public payload?: any, ) { }
}

export class LogoutUserSuccess implements Action {
  readonly type = LOGOUT_USER_SUCCESS;
  constructor(public payload: any, ) { }
}

export class LogoutUserFailure implements Action {
  readonly type = LOGOUT_USER_FAILURE;
  constructor(public payload: any, ) { }
}

// Register
export const REGISTER_USER          = '[Main] Register user';
export const REGISTER_USER_SUCCESS  = '[Main] Register user success';
export const REGISTER_USER_FAILURE  = '[Main] Register user failure';

export class RegisterUser implements Action {
  readonly type = REGISTER_USER;
  constructor(public payload?: fromModels.UserPayload, ) { }
}

export class RegisterUserSuccess implements Action {
  readonly type = REGISTER_USER_SUCCESS;
  constructor(public payload: any, ) { }
}

export class RegisterUserFailure implements Action {
  readonly type = REGISTER_USER_FAILURE;
  constructor(public payload: any, ) { }
}

// Reset
export const RESET_PASSWORD          = '[Main] Reset password';
export const RESET_PASSWORD_SUCCESS  = '[Main] Reset password success';
export const RESET_PASSWORD_FAILURE  = '[Main] Reset password failure';

export class ResetPassword implements Action {
  readonly type = RESET_PASSWORD;
  constructor(public payload?: fromModels.UserPayload, ) { }
}

export class ResetPasswordSuccess implements Action {
  readonly type = RESET_PASSWORD_SUCCESS;
  constructor(public payload: any, ) { }
}

export class ResetPasswordFailure implements Action {
  readonly type = RESET_PASSWORD_FAILURE;
  constructor(public payload: any, ) { }
}

// Set
export const SET_PASSWORD          = '[Main] Set password';
export const SET_PASSWORD_SUCCESS  = '[Main] Set password success';
export const SET_PASSWORD_FAILURE  = '[Main] Set password failure';

export class SetPassword implements Action {
  readonly type = SET_PASSWORD;
  constructor(public payload?: fromModels.UserPayload, ) { }
}

export class SetPasswordSuccess implements Action {
  readonly type = SET_PASSWORD_SUCCESS;
  constructor(public payload: any, ) { }
}

export class SetPasswordFailure implements Action {
  readonly type = SET_PASSWORD_FAILURE;
  constructor(public payload: any, ) { }
}

export type AuthenticationAction =
  | GetUser
  | GetUserSuccess
  | GetUserFailure
  | LoginUser
  | LoginUserSuccess
  | LoginUserFailure
  | LogoutUser
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
