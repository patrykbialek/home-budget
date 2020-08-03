import { OverlayModule } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '@authentication/models';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { AuthenticationHttpService } from '../../services';
import * as fromActions from '../actions';
import { AuthenticationEffects } from './authentication.effects';

const mockUser: User = {
  email: '',
  name: '',
  password: '',
};

fdescribe('Authentication Effects', () => {
  let scheduler: TestScheduler;
  let authenticationEffects: AuthenticationEffects;
  let actions$: Observable<Action>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let authenticationServiceSpy: jasmine.SpyObj<AuthenticationHttpService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        OverlayModule,
      ],
      providers: [
        AuthenticationEffects,
        MatSnackBar,
        provideMockActions(() => actions$),
        {
          provide: AuthenticationHttpService,
          useValue: jasmine.createSpyObj('AuthenticationHttpService',
            ['getUser', 'loginUser', 'logoutUser', 'registerUser', 'resetPassword', 'setPassword'])
        }
      ]
    });

    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    authenticationEffects = TestBed.get(AuthenticationEffects);
    authenticationServiceSpy = TestBed.get(AuthenticationHttpService);
    snackBarSpy = TestBed.get(MatSnackBar);
  });

  describe('getUser$', () => {
    describe('When fetch success', () => {
      it('should return GetUserSuccess action', () => {
        scheduler.run(({ hot, cold, expectObservable }) => {
          const loadUserAction = new fromActions.GetUser;
          const loadUserSuccessAction = new fromActions.GetUserSuccess(mockUser);

          actions$ = hot('5ms a', { a: loadUserAction });
          authenticationServiceSpy.getUser.and.returnValue(
            cold('1s k|', { k: mockUser })
          );

          const expected$ = '5ms 1s z';

          expectObservable(authenticationEffects.getUser$).toBe(expected$, {
            z: loadUserSuccessAction
          });
        });
      });
    });
    describe('When fetch failure', () => {
      it('should return GetUserFailure action', () => {
        scheduler.run(({ hot, cold, expectObservable }) => {
          const getUserAction = new fromActions.GetUser;
          const error = new Error('something went wrong...');
          const getUserFailureAction = new fromActions.GetUserFailure(error);

          actions$ = hot('5ms a', { a: getUserAction });
          authenticationServiceSpy.getUser.and.returnValue(cold('1s #', null, error));

          const expected$ = '5ms 1s z';

          expectObservable(authenticationEffects.getUser$).toBe(expected$, {
            z: getUserFailureAction
          });
        });
      });
    });
  });

  describe('loginUser$', () => {
    describe('When fetch succeeds', () => {
      it('should return LoginUserSuccess action', () => {
        scheduler.run(({ hot, cold, expectObservable }) => {
          const mckUser = { email: '', name: '', uid: '' };
          const loginUserAction = new fromActions.LoginUser;
          const loginUserSuccessAction = new fromActions.LoginUserSuccess(mckUser);

          actions$ = hot('5ms a', { a: loginUserAction });
          authenticationServiceSpy.loginUser.and.returnValue(
            cold('1s k|', { k: mckUser })
          );

          const expected$ = '5ms 1s z';

          expectObservable(authenticationEffects.loginUser$).toBe(expected$, {
            z: loginUserSuccessAction
          });
        });
      });
    });

    describe('When fetch failure', () => {
      it('should return LoginUserFailure action', () => {
        scheduler.run(({ hot, cold, expectObservable }) => {
          const loginUserAction = new fromActions.LoginUser;
          const error = new Error('something went wrong...');
          const loginUserFailureAction = new fromActions.LoginUserFailure(error);
          const openSnackBarSpy = spyOn(snackBarSpy, 'open');

          actions$ = hot('5ms a', { a: loginUserAction });
          authenticationServiceSpy.loginUser.and.returnValue(cold('1s #', null, error));

          const expected$ = '5ms 1s z';

          expectObservable(authenticationEffects.loginUser$).toBe(expected$, {
            z: loginUserFailureAction,
          });
        });
      });
    });
  });

  describe('logoutUser$', () => {
    describe('When fetch succeeds', () => {
      it('should return LogoutUserSuccess action', () => {
        scheduler.run(({ hot, cold, expectObservable }) => {
          const mckUser = { email: '', name: '', uid: '' };
          const logoutUserAction = new fromActions.LogoutUser;
          const logoutUserSuccessAction = new fromActions.LogoutUserSuccess(null);

          actions$ = hot('5ms a', { a: logoutUserAction });
          authenticationServiceSpy.logoutUser.and.returnValue(
            cold('1s k|', { k: null })
          );

          const expected$ = '5ms 1s z';

          expectObservable(authenticationEffects.logoutUser$).toBe(expected$, {
            z: logoutUserSuccessAction
          });
        });
      });
    });

    describe('When fetch failure', () => {
      it('should return LogoutUserFailure action', () => {
        scheduler.run(({ hot, cold, expectObservable }) => {
          const logoutUserAction = new fromActions.LogoutUser;
          const error = new Error('something went wrong...');
          const logoutUserFailureAction = new fromActions.LogoutUserFailure(error);

          actions$ = hot('5ms a', { a: logoutUserAction });
          authenticationServiceSpy.logoutUser.and.returnValue(cold('1s #', null, error));

          const expected$ = '5ms 1s z';

          expectObservable(authenticationEffects.logoutUser$).toBe(expected$, {
            z: logoutUserFailureAction,
          });
        });
      });
    });
  });

  describe('registerUser$', () => {
    describe('When fetch succeeds', () => {
      it('should return RegisterUserSuccess action', () => {
        scheduler.run(({ hot, cold, expectObservable }) => {
          const mckUser = { email: '', name: '', uid: '' };
          const registerUserAction = new fromActions.RegisterUser;
          const registerUserSuccessAction = new fromActions.RegisterUserSuccess(mckUser);
          spyOn(snackBarSpy, 'open');
          actions$ = hot('5ms a', { a: registerUserAction });
          authenticationServiceSpy.registerUser.and.returnValue(
            cold('1s k|', { k: mckUser })
          );

          const expected$ = '5ms 1s z';

          expectObservable(authenticationEffects.registerUser$).toBe(expected$, {
            z: registerUserSuccessAction
          });
        });
      });
    });

    describe('When fetch failure', () => {
      it('should return RegisterUserFailure action', () => {
        scheduler.run(({ hot, cold, expectObservable }) => {
          const registerUserAction = new fromActions.RegisterUser;
          const error = new Error('something went wrong...');
          const registerUserFailureAction = new fromActions.RegisterUserFailure(error);
          const openSnackBarSpy = spyOn(snackBarSpy, 'open');

          actions$ = hot('5ms a', { a: registerUserAction });
          authenticationServiceSpy.registerUser.and.returnValue(cold('1s #', null, error));

          const expected$ = '5ms 1s z';

          expectObservable(authenticationEffects.registerUser$).toBe(expected$, {
            z: registerUserFailureAction,
          });
        });
      });
    });
  });

  describe('resetPassword$', () => {
    describe('When fetch succeeds', () => {
      it('should return ResetPasswordSuccess action', () => {
        scheduler.run(({ hot, cold, expectObservable }) => {
          const resetPasswordAction = new fromActions.ResetPassword;
          const resetPasswordSuccessAction = new fromActions.ResetPasswordSuccess(null);
          spyOn(snackBarSpy, 'open');
          actions$ = hot('5ms a', { a: resetPasswordAction });
          authenticationServiceSpy.resetPassword.and.returnValue(
            cold('1s k|', { k: null })
          );

          const expected$ = '5ms 1s z';

          expectObservable(authenticationEffects.resetPassword$).toBe(expected$, {
            z: resetPasswordSuccessAction
          });
        });
      });
    });

    describe('When fetch failure', () => {
      it('should return ResetPasswordFailure action', () => {
        scheduler.run(({ hot, cold, expectObservable }) => {
          const resetPasswordAction = new fromActions.ResetPassword;
          const error = new Error('something went wrong...');
          const resetPasswordFailureAction = new fromActions.ResetPasswordFailure(error);
          const openSnackBarSpy = spyOn(snackBarSpy, 'open');

          actions$ = hot('5ms a', { a: resetPasswordAction });
          authenticationServiceSpy.resetPassword.and.returnValue(cold('1s #', null, error));

          const expected$ = '5ms 1s z';

          expectObservable(authenticationEffects.resetPassword$).toBe(expected$, {
            z: resetPasswordFailureAction,
          });
        });
      });
    });
  });

  describe('setPassword$', () => {
    describe('When fetch succeeds', () => {
      it('should return SetPasswordSuccess action', () => {
        scheduler.run(({ hot, cold, expectObservable }) => {
          const setPasswordAction = new fromActions.SetPassword;
          const setPasswordSuccessAction = new fromActions.SetPasswordSuccess(null);
          spyOn(snackBarSpy, 'open');
          actions$ = hot('5ms a', { a: setPasswordAction });
          authenticationServiceSpy.setPassword.and.returnValue(
            cold('1s k|', { k: null })
          );

          const expected$ = '5ms 1s z';

          expectObservable(authenticationEffects.setPassword$).toBe(expected$, {
            z: setPasswordSuccessAction
          });
        });
      });
    });

    describe('When fetch failure', () => {
      it('should return SetPasswordFailure action', () => {
        scheduler.run(({ hot, cold, expectObservable }) => {
          const setPasswordAction = new fromActions.SetPassword;
          const error = new Error('something went wrong...');
          const setPasswordFailureAction = new fromActions.SetPasswordFailure(error);
          const openSnackBarSpy = spyOn(snackBarSpy, 'open');

          actions$ = hot('5ms a', { a: setPasswordAction });
          authenticationServiceSpy.setPassword.and.returnValue(cold('1s #', null, error));

          const expected$ = '5ms 1s z';

          expectObservable(authenticationEffects.setPassword$).toBe(expected$, {
            z: setPasswordFailureAction,
          });
        });
      });
    });
  });
});
