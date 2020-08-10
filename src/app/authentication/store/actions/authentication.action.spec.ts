import * as fromAuthentication from './authentication.actions';
import { UserPayload } from '@authentication/models';

fdescribe('Authentication Actions', () => {

  describe('SetUser Actions', () => {
    describe('SetUser', () => {
      it('should create an action', () => {
        const payload = { uid: 'test' };
        const action = new fromAuthentication.SetUser(payload);

        expect({ ...action }).toEqual({
          type: fromAuthentication.SET_USER,
          payload,
        });
      });
    });

    describe('SetUserSuccess', () => {
      it('should create an action', () => {
        const payload = { email: null, displayName: null, uid: 'test' };
        const action = new fromAuthentication.SetUserSuccess(payload);

        expect({ ...action }).toEqual({
          type: fromAuthentication.SET_USER_SUCCESS,
          payload,
        });
      });
    });

    describe('SetUserFailure', () => {
      it('should create an action', () => {
        const payload = { uid: 'test' };
        const action = new fromAuthentication.SetUserFailure(null);

        expect({ ...action }).toEqual({
          type: fromAuthentication.SET_USER_FAILURE,
          payload: null,
        });
      });
    });
  });

  describe('LoginUser Actions', () => {
    describe('LoginUser', () => {
      it('should create an action', () => {
        const payload = { email: null, password: 'test' };
        const action = new fromAuthentication.LoginUser(payload);

        expect({ ...action }).toEqual({
          type: fromAuthentication.LOGIN_USER,
          payload,
        });
      });
    });

    describe('LoginUserSuccess', () => {
      it('should create an action', () => {
        const payload = { email: null, displayName: null, uid: 'test' };
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
        const action = new fromAuthentication.LoginUserFailure();

        expect({ ...action }).toEqual({
          type: fromAuthentication.LOGIN_USER_FAILURE,
        });
      });
    });
  });

  describe('LogoutUser Actions', () => {
    describe('LogoutUser', () => {
      it('should create an action', () => {
        const action = new fromAuthentication.LogoutUserFromContainer();

        expect({ ...action }).toEqual({
          type: fromAuthentication.LOGOUT_USER_FROM_CONTAINER,
        });
      });
    });

    describe('LogoutUserSuccess', () => {
      it('should create an action', () => {
        const action = new fromAuthentication.LogoutUserSuccess();

        expect({ ...action }).toEqual({
          type: fromAuthentication.LOGOUT_USER_SUCCESS,
        });
      });
    });

    describe('LogoutUserFailure', () => {
      it('should create an action', () => {
        const action = new fromAuthentication.LogoutUserFailure();

        expect({ ...action }).toEqual({
          type: fromAuthentication.LOGOUT_USER_FAILURE,
        });
      });
    });
  });

  describe('RegisterUser Actions', () => {
    describe('LogoutUser', () => {
      it('should create an action', () => {
        const payload = {
          email: 'string',
          name: 'string',
          password: 'string',
        };
        const action = new fromAuthentication.RegisterUser(payload);

        expect({ ...action }).toEqual({
          type: fromAuthentication.REGISTER_USER,
          payload,
        });
      });
    });

    describe('RegisterUserSuccess', () => {
      it('should create an action', () => {
        const payload = { email: null, displayName: null, uid: 'test' };
        const action = new fromAuthentication.RegisterUserSuccess(payload);

        expect({ ...action }).toEqual({
          type: fromAuthentication.REGISTER_USER_SUCCESS,
          payload,
        });
      });
    });

    describe('RegisterUserFailure', () => {
      it('should create an action', () => {
        const action = new fromAuthentication.RegisterUserFailure();

        expect({ ...action }).toEqual({
          type: fromAuthentication.REGISTER_USER_FAILURE,
        });
      });
    });
  });

  describe('ResetPassword Actions', () => {
    describe('ResetPassword', () => {
      it('should create an action', () => {
        const payload = {
          email: 'string',
          name: 'string',
          password: 'string',
        };
        const action = new fromAuthentication.ResetPassword(payload);

        expect({ ...action }).toEqual({
          type: fromAuthentication.RESET_PASSWORD,
          payload,
        });
      });
    });

    describe('ResetPasswordSuccess', () => {
      it('should create an action', () => {
        const action = new fromAuthentication.ResetPasswordSuccess();

        expect({ ...action }).toEqual({
          type: fromAuthentication.RESET_PASSWORD_SUCCESS,
        });
      });
    });

    describe('ResetPasswordFailure', () => {
      it('should create an action', () => {
        const action = new fromAuthentication.ResetPasswordFailure();

        expect({ ...action }).toEqual({
          type: fromAuthentication.RESET_PASSWORD_FAILURE,
        });
      });
    });
  });

  describe('SetPassword Actions', () => {
    describe('SetPassword', () => {
      it('should create an action', () => {
        const payload = {
          newPassword: 'newPassword',
          oobCode: 'oobCode'
        };
        const action = new fromAuthentication.SetPassword(payload);

        expect({ ...action }).toEqual({
          type: fromAuthentication.SET_PASSWORD,
          payload,
        });
      });
    });

    describe('SetPasswordSuccess', () => {
      it('should create an action', () => {
        const action = new fromAuthentication.SetPasswordSuccess();

        expect({ ...action }).toEqual({
          type: fromAuthentication.SET_PASSWORD_SUCCESS,
        });
      });
    });

    describe('SetPasswordFailure', () => {
      it('should create an action', () => {
        const action = new fromAuthentication.SetPasswordFailure();

        expect({ ...action }).toEqual({
          type: fromAuthentication.SET_PASSWORD_FAILURE,
        });
      });
    });
  });

});
