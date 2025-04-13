import { Injectable } from '@angular/core';
import { User } from './user.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Subject, throwError } from 'rxjs';
import { environment } from './../../../environments/environment';

const AUTHENTICATION_API = environment.apiHelpDeskUrl;

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  public $gRefreshToken = new Subject<boolean>();

  constructor(private http: HttpClient) {
    this.$gRefreshToken.subscribe((res: any) => {
      this.GetRefreshJWt();
    });
  }

  SetLocalStorage(key: string, value: any) {
    localStorage.setItem(key, value);
  }

  SetLocalStorageJSON(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  ClearLocalStorage() {
    localStorage.clear();
  }

  GetLocalStorageJSON(key: string, value: string) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item)[value] : null;
  }

  GetLocalStorage(key: string) {
    return localStorage.getItem(key);
  }

  GetJWT(user: User) {
    return this.http.post(
      `${AUTHENTICATION_API}/api/Authentication/PostToken`,
      user,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      }
    );
  }

  isMobile(): boolean {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const mobileThreshold = 768;

    return Math.min(width, height) <= mobileThreshold;
  }

  GetRefreshJWt() {
    //debugger;
    //localStorage.removeItem('jwt');
    // let user: User = {
    // };
    // this.GetJWT(user);
  }
}
