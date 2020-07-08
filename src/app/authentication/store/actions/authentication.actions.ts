import { Action } from '@ngrx/store';

import * as fromModels from '../../models';

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

export type AuthenticationAction =
  | LoginUser
  | LoginUserSuccess
  | LoginUserFailure
  | RegisterUser
  | RegisterUserSuccess
  | RegisterUserFailure

  ;
