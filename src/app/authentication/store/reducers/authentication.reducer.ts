import * as fromAuthentication from '../actions/authentication.actions';

export interface AuthenticationState {
  entity: any;
  isFailed: boolean;
  isLoading: boolean;
  isSuccess: boolean;
}

export const initialState: AuthenticationState = {
  entity: null,
  isFailed: false,
  isLoading: false,
  isSuccess: false,
};

export function reducer(
  state = initialState,
  action: fromAuthentication.AuthenticationAction
): AuthenticationState {

  switch (action.type) {

    case fromAuthentication.GET_USER: {

      return {
        ...state,
        isFailed: false,
        isLoading: true,
        isSuccess: false,
      };
    }

    case fromAuthentication.GET_USER_SUCCESS: {
      const user = action.payload;

      return {
        ...state,
        entity: user,
        isFailed: false,
        isLoading: true,
        isSuccess: false,
      };
    }

    case fromAuthentication.LOGIN_USER:
    case fromAuthentication.LOGOUT_USER:
    case fromAuthentication.REGISTER_USER:
    case fromAuthentication.RESET_PASSWORD:
    case fromAuthentication.SET_PASSWORD: {
      return {
        ...state,
        entity: null,
        isFailed: false,
        isLoading: true,
        isSuccess: false,
      };
    }

    case fromAuthentication.LOGIN_USER_SUCCESS:
    case fromAuthentication.LOGOUT_USER_SUCCESS:
    case fromAuthentication.REGISTER_USER_SUCCESS:
    case fromAuthentication.RESET_PASSWORD_SUCCESS:
    case fromAuthentication.SET_PASSWORD_SUCCESS: {
      const user = action.payload;

      return {
        ...state,
        entity: user,
        isFailed: false,
        isLoading: false,
        isSuccess: true,
      };
    }

    case fromAuthentication.LOGIN_USER_FAILURE:
    case fromAuthentication.LOGOUT_USER_FAILURE:
    case fromAuthentication.REGISTER_USER_FAILURE:
    case fromAuthentication.RESET_PASSWORD_FAILURE:
    case fromAuthentication.SET_PASSWORD_FAILURE: {
      return {
        ...state,
        entity: null,
        isFailed: true,
        isLoading: false,
        isSuccess: false,
      };
    }

  }

  return state;
}

export const getIsFailed = (state: AuthenticationState) => state.isFailed;
export const getIsLoading = (state: AuthenticationState) => state.isLoading;
export const getIsSuccess = (state: AuthenticationState) => state.isSuccess;
export const getUser = (state: AuthenticationState) => state.entity;
