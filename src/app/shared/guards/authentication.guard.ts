import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LoginService } from '../../login/login.service';
import { AuthenticationService } from '../services/authentication.service';

export const authenticationGuard: CanActivateFn = () => {
  const sLogin = inject(LoginService);
  const sAuthentication = inject(AuthenticationService);
  const router = inject(Router);

  const item = localStorage.getItem('config');
  const jwt = item ? JSON.parse(item)[0]['key'] : null;

  if (!jwt) {
    sAuthentication.DeleteUser();
    router.navigate(['/login']);
    return false;
  }

  return true;
};
