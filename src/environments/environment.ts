// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    urlSignUp:
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCxqs7v_kQt2oiWKkA52UBMcEAdSQkf0kE',
    urlSignIn:
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCxqs7v_kQt2oiWKkA52UBMcEAdSQkf0kE',
    firebase: {
        apiKey: 'AIzaSyCxqs7v_kQt2oiWKkA52UBMcEAdSQkf0kE',
        authDomain: 'medico-4c2e3.firebaseapp.com',
        databaseURL:
            'https://medico-4c2e3-default-rtdb.asia-southeast1.firebasedatabase.app',
        projectId: 'medico-4c2e3',
        storageBucket: 'medico-4c2e3.appspot.com',
        messagingSenderId: '851800258380',
        appId: '1:851800258380:web:119fc18bd1fd527c9281e9',
    },
    streamIO: {
        key: 'vzjz4e946w2c'
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
