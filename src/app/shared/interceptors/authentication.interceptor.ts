import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoginService } from '../../security/login/login.service';
import { AuthenticationService } from '../services/authentication.service';

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  const sLogin = inject(LoginService);
  const sAuthentication = inject(AuthenticationService);
  const router = inject(Router);
  const item = localStorage.getItem('config');
  const jwt = item ? JSON.parse(item)[0]['key'] : null;

  let request = req;

  if (jwt) {
    if (sAuthentication.isJwtValid(jwt)) {
      request = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + jwt,
        },
      });
    } else {
      sAuthentication.DeleteUser();
      const isMobile = sLogin.isMobile();
      const loginRoute = isMobile ? '/login-mobile' : '/login';
      router.navigate([loginRoute]);
      localStorage.clear();
    }
  }
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        sAuthentication.DeleteUser();
        const isMobile = sLogin.isMobile();

        const loginRoute = isMobile ? '/login-mobile' : '/login';

        router.navigate([loginRoute]);

        localStorage.clear();
      }
      return throwError(error);
    })
  );
};
