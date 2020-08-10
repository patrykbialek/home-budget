import * as fromAuthentication from './authentication.reducer';
import * as fromActions from '../actions/authentication.actions';
import { User } from '@authentication/models';

fdescribe('AuthenticationReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromAuthentication;
      const action = {} as any;
      const state = fromAuthentication.reducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('SET_USER action', () => {
    it('should set loading to true', () => {
      const { initialState } = fromAuthentication;
      const action = new fromActions.SetUser(null);
      const state = fromAuthentication.reducer(initialState, action);

      expect(state.isFailed).toEqual(false);
      expect(state.isLoading).toEqual(true);
      expect(state.isSuccess).toEqual(false);
      expect(state.entity).toEqual(null);
    });
  });

  describe('SET_USER_SUCCESS action', () => {
    it('should populate user object', () => {
      const user: User = {
        email: 'string;',
        displayName: 'string;',
        uid: 'string;',
      };
      const entity = user;
      const { initialState } = fromAuthentication;
      const action = new fromActions.SetUserSuccess(user);
      const state = fromAuthentication.reducer(initialState, action);

      expect(state.isFailed).toEqual(false);
      expect(state.isLoading).toEqual(false);
      expect(state.isSuccess).toEqual(true);
      expect(state.entity).toEqual(entity);
    });
  });

  describe('LOGIN_USER action', () => {
    it('should return the initial state', () => {
      const { initialState } = fromAuthentication;
      const payload = {
        email: 'email',
        password: 'password',
      };
      const action = new fromActions.LoginUser(payload);
      const state = fromAuthentication.reducer(initialState, action);

      expect(state.entity).toEqual(null);
      expect(state.isFailed).toEqual(false);
      expect(state.isLoading).toEqual(true);
      expect(state.isSuccess).toEqual(false);
    });
  });

  describe('LOGIN_USER_SUCCESS action', () => {
    it('should return the initial state', () => {
      const { initialState } = fromAuthentication;
      const user: User = {
        email: 'string;',
        displayName: 'string;',
        uid: 'string;',
      };
      const entity = user;
      const action = new fromActions.LoginUserSuccess(user);
      const state = fromAuthentication.reducer(initialState, action);

      expect(state.entity).toEqual(entity);
      expect(state.isFailed).toEqual(false);
      expect(state.isLoading).toEqual(false);
      expect(state.isSuccess).toEqual(true);
    });
  });

  describe('LOGIN_USER_FAILURE action', () => {
    it('should return the initial state', () => {
      const { initialState } = fromAuthentication;
      const entity = null;
      const action = new fromActions.LoginUserFailure();
      const state = fromAuthentication.reducer(initialState, action);

      expect(state.entity).toEqual(entity);
      expect(state.isFailed).toEqual(true);
      expect(state.isLoading).toEqual(false);
      expect(state.isSuccess).toEqual(false);
    });
  });

  describe('LOGOUT_USER_SUCCESS action', () => {
    it('should return the initial state', () => {
      const { initialState } = fromAuthentication;
      const entity = null;
      const action = new fromActions.LogoutUserSuccess();
      const state = fromAuthentication.reducer(initialState, action);

      expect(state.entity).toEqual(entity);
      expect(state.isFailed).toEqual(false);
      expect(state.isLoading).toEqual(false);
      expect(state.isSuccess).toEqual(true);
    });
  });

  describe('SET_USER_FAILURE action', () => {
    it('should return the initial state', () => {
      const { initialState } = fromAuthentication;
      const entity = null;
      const action = new fromActions.SetUserFailure(null);
      const state = fromAuthentication.reducer(initialState, action);

      expect(state.entity).toEqual(entity);
      expect(state.isFailed).toEqual(true);
      expect(state.isLoading).toEqual(false);
      expect(state.isSuccess).toEqual(false);
    });
  });

});

describe('AuthenticationReducer Selectors', () => {
  describe('getIsFailed', () => {
    it('should return .isFailed', () => {
      const { initialState } = fromAuthentication;
      const previousState = { ...initialState, isFailed: true };
      const slice = fromAuthentication.getIsFailed(previousState);

      expect(slice).toEqual(true);
    });
  });

  describe('getIsLoading', () => {
    it('should return .isLoading', () => {
      const { initialState } = fromAuthentication;
      const previousState = { ...initialState, isLoading: true };
      const slice = fromAuthentication.getIsLoading(previousState);

      expect(slice).toEqual(true);
    });
  });

  describe('getIsSuccess', () => {
    it('should return .isSuccess', () => {
      const { initialState } = fromAuthentication;
      const previousState = { ...initialState, isSuccess: true };
      const slice = fromAuthentication.getIsSuccess(previousState);

      expect(slice).toEqual(true);
    });
  });

  describe('getUser', () => {
    it('should return .entity', () => {
      const entity: User = {
        email: 'dd',
        displayName: 'dd',
        uid: 'dd',
      };
      const { initialState } = fromAuthentication;
      const previousState = { ...initialState, entity };
      const slice = fromAuthentication.getUser(previousState);

      expect(slice).toEqual(entity);
    });
  });
});
