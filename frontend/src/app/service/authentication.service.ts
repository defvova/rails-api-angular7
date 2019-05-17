import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as global from '../configs/const';

import { ApiService } from './api.service';
import { User } from '../interface/user';

@Injectable({ providedIn: 'root' })

export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private authResp: Observable<any>;

  constructor(
    private http: HttpClient,
    private api: ApiService
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public checkCurrentUser() {
    this.api.get('/sessions/new').subscribe((resp) => {
      this.setCurrentUser(resp.data);
    }, console.log);
  }

  public setCurrentUser(user: any) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  public authGithub(callback) {
    const wind = window.open(`${global.baseApiUrl}/auth/github`, 'Github', 'height=600,width=550');
    let authResp: Observable<any>;

    wind.onload = () => {
      authResp = this.api.get('/sessions/new').pipe(
        map(resp => {
          if (resp && resp.data && resp.data.id) {
            this.setCurrentUser(resp.data);
          }

          wind.close();
          return resp;
        })
      );
      return callback(authResp);
    };
  }

  public login(email: string, password: string) {
    return this.http.post<any>(`${global.apiUrl}/sessions`, { session: { email, password }}).pipe(
      map(resp => {
        if (resp && resp.data && resp.data.id) {
          this.setCurrentUser(resp.data);
        }

        return resp;
      })
    );
  }

  public logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
