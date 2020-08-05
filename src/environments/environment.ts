// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const firebase = {
  apiKey: 'AIzaSyDrKQ85ek5udakDHzLL3rqiR5vb3zKo57E',
  authDomain: 'home-bugdet.firebaseapp.com',
  databaseURL: 'https://home-bugdet.firebaseio.com',
  projectId: 'home-bugdet',
  storageBucket: 'home-bugdet.appspot.com',
  messagingSenderId: '40439845811',
  appId: '1:40439845811:web:8ac5fbe849c74369b031c6',
  measurementId: 'G-0H1JGY7CNR'
};

export const environment = {
  production: false,
  firebase,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
