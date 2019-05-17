import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import * as global from '../configs/const';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse): Observable<any> {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: ${error.error}`
      );
    }

    return throwError(error);
  }

  private extractData(res: Response): object {
    return res || {};
  }

  private reqGet(url: string, method: string): Observable<any> {
    return this.http[method](global.apiUrl + url, global.httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  private reqPost(url: string, method: string, body: object): Observable<any> {
    return this.http[method](global.apiUrl + url, body, global.httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  public get(url: string): Observable<any> { return this.reqGet(url, 'get'); }
  public delete(url: string): Observable<any> { return this.reqGet(url, 'delete'); }
  public post(url: string, body: object): Observable<any> { return this.reqPost(url, 'post', body); }
}
