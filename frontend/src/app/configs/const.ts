import { HttpHeaders } from '@angular/common/http';

export const baseApiUrl = 'http://localhost:3000';
export const apiUrl = `${baseApiUrl}/api/v1`;
export const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type':  'application/json' }),
  withCredentials: true
};
