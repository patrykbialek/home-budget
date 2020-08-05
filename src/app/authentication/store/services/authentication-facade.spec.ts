import { inject, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import * as fromActions from '../actions';
import * as fromReducers from '../reducers';
import { AuthenticationFacadeService } from './authentication-facade.service';

let storeStub;

const providers = [
  Store,
];
const imports = [
  StoreModule.forRoot({})
];

fdescribe('AuthenticationFacadeService', () => {
  let service: AuthenticationFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports,
      providers,
    });
    service = TestBed.inject(AuthenticationFacadeService);
  });

  beforeEach(() => {
    storeStub = TestBed.get(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when getUser', whenGetUser);
  describe('when loginUser', whenLoginUser);
  describe('when logoutUser', whenLogoutUser);
  describe('when registerUser', whenRegisterUser);
  describe('when resetPassword', whenResetPassword);
  describe('when setPassword', whenSetPassword);
});

function whenGetUser() {
  let service: AuthenticationFacadeService;

  beforeEach(inject([Store],
    (store: Store<fromReducers.MainState>) => {
      service = new AuthenticationFacadeService(store);
    }));

  it(`should call 'dispatch' method with provided TransactionPayload when 'getUser' is called `, () => {
    const dispatchSpy = spyOn(storeStub, 'dispatch');
    const payload = {
      key: 'string',
      value: null,
      uid: 'string',
    };
    const action = new fromActions.GetUser(payload);

    service.getUser(payload);
    expect(dispatchSpy).toHaveBeenCalledWith(action);
  });
}

function whenLoginUser() {
  let service: AuthenticationFacadeService;

  beforeEach(inject([Store],
    (store: Store<fromReducers.MainState>) => {
      service = new AuthenticationFacadeService(store);
    }));

  it(`should call 'dispatch' method with provided TransactionPayload when 'loginUser' is called `, () => {
    const dispatchSpy = spyOn(storeStub, 'dispatch');
    const payload = {
      key: 'string',
      value: null,
      uid: 'string',
    };
    const action = new fromActions.LoginUser(payload);

    service.loginUser(payload);
    expect(dispatchSpy).toHaveBeenCalledWith(action);
  });
}

function whenLogoutUser() {
  let service: AuthenticationFacadeService;

  beforeEach(inject([Store],
    (store: Store<fromReducers.MainState>) => {
      service = new AuthenticationFacadeService(store);
    }));

  it(`should call 'dispatch' method with provided TransactionPayload when 'LogoutUser' is called `, () => {
    const dispatchSpy = spyOn(storeStub, 'dispatch');
    const action = new fromActions.LogoutUser();

    service.logoutUser();
    expect(dispatchSpy).toHaveBeenCalled();
  });
}


function whenRegisterUser() {
  let service: AuthenticationFacadeService;

  beforeEach(inject([Store],
    (store: Store<fromReducers.MainState>) => {
      service = new AuthenticationFacadeService(store);
    }));

  it(`should call 'dispatch' method with provided TransactionPayload when 'registerUser' is called `, () => {
    const dispatchSpy = spyOn(storeStub, 'dispatch');
    const payload = {
      key: 'string',
      value: null,
      uid: 'string',
    };
    const action = new fromActions.RegisterUser(payload);

    service.registerUser(payload);
    expect(dispatchSpy).toHaveBeenCalledWith(action);
  });
}

function whenResetPassword() {
  let service: AuthenticationFacadeService;

  beforeEach(inject([Store],
    (store: Store<fromReducers.MainState>) => {
      service = new AuthenticationFacadeService(store);
    }));

  it(`should call 'dispatch' method with provided TransactionPayload when 'resetPassword' is called `, () => {
    const dispatchSpy = spyOn(storeStub, 'dispatch');
    const payload = {
      key: 'string',
      value: null,
      uid: 'string',
    };
    const action = new fromActions.ResetPassword(payload);

    service.resetPassword(payload);
    expect(dispatchSpy).toHaveBeenCalledWith(action);
  });
}

function whenSetPassword() {
  let service: AuthenticationFacadeService;

  beforeEach(inject([Store],
    (store: Store<fromReducers.MainState>) => {
      service = new AuthenticationFacadeService(store);
    }));

  it(`should call 'dispatch' method with provided TransactionPayload when 'setPassword' is called `, () => {
    const dispatchSpy = spyOn(storeStub, 'dispatch');
    const payload = {
      key: 'string',
      value: null,
      uid: 'string',
    };
    const action = new fromActions.SetPassword(payload);

    service.setPassword(payload);
    expect(dispatchSpy).toHaveBeenCalledWith(action);
  });
}
