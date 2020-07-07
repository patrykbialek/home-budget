import { Action } from '@ngrx/store';

import * as fromModels from '../../models';

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
  | RegisterUser
  | RegisterUserSuccess
  | RegisterUserFailure

  ;
