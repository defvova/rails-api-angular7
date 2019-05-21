import { HttpHeaders } from '@angular/common/http';

export const environment = {
  production: false,
  baseApiUrl: 'http://localhost:3000',
  apiUrl: 'http://localhost:3000/api/v1',
  httpOptions: {
    headers: new HttpHeaders({ 'Content-Type':  'application/json' }),
    withCredentials: true
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
