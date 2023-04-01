// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const firebaseConfig = {
  apiKey: "AIzaSyCLCtXr5x8lU6zR62v1_4SizsaDPlq_aBk",
  authDomain: "plan-and-budget.firebaseapp.com",
  databaseURL: "https://plan-and-budget-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "plan-and-budget",
  storageBucket: "plan-and-budget.appspot.com",
  messagingSenderId: "778760946828",
  appId: "1:778760946828:web:a53eedaf1f3249373227a9",
  measurementId: "G-KS8KJF6ZQ5"
};

export const environment = {
  production: false,
  firebaseConfig,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
