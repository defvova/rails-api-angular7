import { HttpHeaders } from '@angular/common/http';
import { isDevMode } from '@angular/core';

export const baseApiUrl = isDevMode() ? 'http://localhost:3000' : 'https://rails-api-github-trending.herokuapp.com';
export const apiUrl = `${baseApiUrl}/api/v1`;
export const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type':  'application/json' }),
  withCredentials: true
};
