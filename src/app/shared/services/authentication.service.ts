import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private gAccess = new BehaviorSubject<any>({
    access: '',
    language: '',
    country: '',
    tasks: [
      {
        list: '',
        keyList: '',
      },
    ],
    key: '',
  });

  public gAccess$ = this.gAccess.asObservable();

  constructor(private http: HttpClient) {
    this.SetUser();
  }

  SetUser() {
    const gParameter = localStorage.getItem('config');
    if (gParameter) {
      this.gAccess.next(JSON.parse(gParameter)[0]);
    }
  }

  SetCookie(name: string, value: string, days: number): void {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = '; expires=' + date.toUTCString();
    }

    // Check if the cookie exists and update its value if it does
    const existingCookie = document.cookie
      .split(';')
      .find((cookie) => cookie.trim().startsWith(name + '='));
    if (existingCookie) {
      const updatedCookie =
        existingCookie.replace(/=.*/, '=' + value) + expires + '; path=/';
      document.cookie = updatedCookie;
    } else {
      // Create the cookie if it doesn't exist
      document.cookie = name + '=' + value + expires + '; path=/';
    }
  }

  GetCookie(name: string): string {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return '';
  }

  DeleteUser(): void {
    this.gAccess.next({
      access: '',
      language: '',
      country: '',
      tasks: [
        {
          list: '',
          keyList: '',
        },
      ],
      key: '',
    });

    localStorage.removeItem('config');
  }

  isJwtValid(jwt: string): boolean {
    // Check if JWT is expired
    const jwtData = jwt.split('.')[1];
    const decodedJwtJsonData = window.atob(jwtData);
    const decodedJwtData = JSON.parse(decodedJwtJsonData);

    const jwtExpiryDate = decodedJwtData.exp;
    const currentDateTime = new Date().getTime() / 1000;

    return jwtExpiryDate > currentDateTime;
  }
}
