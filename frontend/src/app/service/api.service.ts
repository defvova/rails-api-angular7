import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { environment } from '../../environments/environment';

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
    return this.http[method](environment.apiUrl + url, environment.httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  private reqPost(url: string, method: string, body: object): Observable<any> {
    return this.http[method](environment.apiUrl + url, body, environment.httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  public get(url: string): Observable<any> { return this.reqGet(url, 'get'); }
  public delete(url: string): Observable<any> { return this.reqGet(url, 'delete'); }
  public post(url: string, body: object): Observable<any> { return this.reqPost(url, 'post', body); }
  public update(url: string, body: object): Observable<any> { return this.reqPost(url, 'put', body); }
}
