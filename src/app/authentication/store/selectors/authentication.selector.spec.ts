// import { StoreModule, Store, combineReducers } from '@ngrx/store';

// import { TestBed } from '@angular/core/testing';

// import * as fromReducers from '../reducers/index';
// import * as fromActions from '../actions/index';
// import * as fromSelectors from '../selectors/authentication.selector';
// import { User } from '@authentication/models';

// fdescribe('Authentication Selectors', () => {
//   let store: Store<fromReducers.MainState>;

//   const user: User = {
//     email: 'dd',
//     displayName: 'dd',
//     uid: 'dd',
//   };

//   const entity = user;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         StoreModule.forRoot({
//           authentication: combineReducers(fromReducers.reducers),
//         }),
//       ],
//     });

//     store = TestBed.get(Store);
//   });

//   describe('getAuthenticationState', () => {
//     it('should return state of user store slice', () => {
//       let result;

//       store
//         .select(fromSelectors.getAuthenticationState)
//         .subscribe(value => (result = value));

//       expect(result).toEqual({
//         entity: null,
//         isFailed: false,
//         isLoading: false,
//         isSuccess: false,
//       });

//       store.dispatch(new fromActions.SetUserSuccess(user));

//       expect(result).toEqual({
//         entity,
//         isFailed: false,
//         isLoading: false,
//         isSuccess: true,
//       });
//     });
//   });

//   describe('getIsSuccess', () => {
//     it('should return the user isSuccess state', () => {
//       let result;

//       store
//         .select(fromSelectors.getIsSuccess)
//         .subscribe(value => (result = value));

//       expect(result).toEqual(false);

//       store.dispatch(new fromActions.SetUserSuccess(null));

//       expect(result).toEqual(true);
//     });
//   });

//   describe('getUser', () => {
//     it('should return the user entity state', () => {
//       let result;

//       store
//         .select(fromSelectors.getUser)
//         .subscribe(value => (result = value));

//       expect(result).toEqual(null);

//       const payload = {
//         displayName: 'displayName',
//         email: 'email',
//         uid: 'uid',
//       };
//       store.dispatch(new fromActions.SetUserSuccess(payload));

//       expect(result).toEqual(payload);
//     });
//   });
// });
