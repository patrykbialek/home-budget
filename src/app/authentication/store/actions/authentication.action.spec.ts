import * as fromAuthentication from './authentication.actions';
import { UserPayload } from '@authentication/models';

fdescribe('Authentication Actions', () => {

  describe('GetUser Actions', () => {
    describe('GetUser', () => {
      it('should create an action', () => {
        const payload = { uid: 'test' };
        const action = new fromAuthentication.GetUser(payload);

        expect({ ...action }).toEqual({
          type: fromAuthentication.GET_USER,
          payload,
        });
      });
    });

    describe('GetUserSuccess', () => {
      it('should create an action', () => {
        const payload = { uid: 'test' };
        const action = new fromAuthentication.GetUserSuccess(payload);

        expect({ ...action }).toEqual({
          type: fromAuthentication.GET_USER_SUCCESS,
          payload,
        });
      });
    });

    describe('GetUserFailure', () => {
      it('should create an action', () => {
        const payload = { uid: 'test' };
        const action = new fromAuthentication.GetUserFailure(payload);

        expect({ ...action }).toEqual({
          type: fromAuthentication.GET_USER_FAILURE,
          payload,
        });
      });
    });
  });

  describe('LoginUser Actions', () => {
    describe('LoginUser', () => {
      it('should create an action', () => {
        const payload = { uid: 'test' };
        const action = new fromAuthentication.LoginUser(payload);

        expect({ ...action }).toEqual({
          type: fromAuthentication.LOGIN_USER,
          payload,
        });
      });
    });

    describe('LoginUserSuccess', () => {
      it('should create an action', () => {
        const payload = { uid: 'test' };
        const action = new fromAuthentication.LoginUserSuccess(payload);

        expect({ ...action }).toEqual({
          type: fromAuthentication.LOGIN_USER_SUCCESS,
          payload,
        });
      });
    });

    describe('LoginUserFailure', () => {
      it('should create an action', () => {
        const payload = { uid: 'test' };
        const action = new fromAuthentication.LoginUserFailure(payload);

        expect({ ...action }).toEqual({
          type: fromAuthentication.LOGIN_USER_FAILURE,
          payload,
        });
      });
    });
  });

  describe('LogoutUser Actions', () => {
    describe('LogoutUser', () => {
      it('should create an action', () => {
        const payload = { uid: 'test' };
        const action = new fromAuthentication.LogoutUser(payload);

        expect({ ...action }).toEqual({
          type: fromAuthentication.LOGOUT_USER,
          payload,
        });
      });
    });

    describe('LogoutUserSuccess', () => {
      it('should create an action', () => {
        const payload = { uid: 'test' };
        const action = new fromAuthentication.LogoutUserSuccess(payload);

        expect({ ...action }).toEqual({
          type: fromAuthentication.LOGOUT_USER_SUCCESS,
          payload,
        });
      });
    });

    describe('LogoutUserFailure', () => {
      it('should create an action', () => {
        const payload = { uid: 'test' };
        const action = new fromAuthentication.LogoutUserFailure(payload);

        expect({ ...action }).toEqual({
          type: fromAuthentication.LOGOUT_USER_FAILURE,
          payload,
        });
      });
    });
  });

  describe('RegisterUser Actions', () => {
    describe('LogoutUser', () => {
      it('should create an action', () => {
        const payload: UserPayload = {
          key: 'test',
          value: {
            email: 'string',
            name: 'string',
            password: 'string',
            code: 'any',
          }
        }
        const action = new fromAuthentication.RegisterUser(payload);

        expect({ ...action }).toEqual({
          type: fromAuthentication.REGISTER_USER,
          payload,
        });
      });
    });

    describe('RegisterUserSuccess', () => {
      it('should create an action', () => {
        const payload = { uid: 'test' };
        const action = new fromAuthentication.RegisterUserSuccess(payload);

        expect({ ...action }).toEqual({
          type: fromAuthentication.REGISTER_USER_SUCCESS,
          payload,
        });
      });
    });

    describe('RegisterUserFailure', () => {
      it('should create an action', () => {
        const payload = { uid: 'test' };
        const action = new fromAuthentication.RegisterUserFailure(payload);

        expect({ ...action }).toEqual({
          type: fromAuthentication.REGISTER_USER_FAILURE,
          payload,
        });
      });
    });
  });

  describe('ResetPassword Actions', () => {
    describe('ResetPassword', () => {
      it('should create an action', () => {
        const payload: UserPayload = {
          key: 'test',
          value: {
            email: 'string',
            name: 'string',
            password: 'string',
            code: 'any',
          }
        }
        const action = new fromAuthentication.ResetPassword(payload);

        expect({ ...action }).toEqual({
          type: fromAuthentication.RESET_PASSWORD,
          payload,
        });
      });
    });

    describe('ResetPasswordSuccess', () => {
      it('should create an action', () => {
        const payload = { uid: 'test' };
        const action = new fromAuthentication.ResetPasswordSuccess(payload);

        expect({ ...action }).toEqual({
          type: fromAuthentication.RESET_PASSWORD_SUCCESS,
          payload,
        });
      });
    });

    describe('ResetPasswordFailure', () => {
      it('should create an action', () => {
        const payload = { uid: 'test' };
        const action = new fromAuthentication.ResetPasswordFailure(payload);

        expect({ ...action }).toEqual({
          type: fromAuthentication.RESET_PASSWORD_FAILURE,
          payload,
        });
      });
    });
  });

  describe('SetPassword Actions', () => {
    describe('SetPassword', () => {
      it('should create an action', () => {
        const payload: UserPayload = {
          key: 'test',
          value: {
            email: 'string',
            name: 'string',
            password: 'string',
            code: 'any',
          }
        }
        const action = new fromAuthentication.SetPassword(payload);

        expect({ ...action }).toEqual({
          type: fromAuthentication.SET_PASSWORD,
          payload,
        });
      });
    });

    describe('SetPasswordSuccess', () => {
      it('should create an action', () => {
        const payload = { uid: 'test' };
        const action = new fromAuthentication.SetPasswordSuccess(payload);

        expect({ ...action }).toEqual({
          type: fromAuthentication.SET_PASSWORD_SUCCESS,
          payload,
        });
      });
    });

    describe('SetPasswordFailure', () => {
      it('should create an action', () => {
        const payload = { uid: 'test' };
        const action = new fromAuthentication.SetPasswordFailure(payload);

        expect({ ...action }).toEqual({
          type: fromAuthentication.SET_PASSWORD_FAILURE,
          payload,
        });
      });
    });
  });

});
