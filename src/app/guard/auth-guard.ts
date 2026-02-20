import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

  const servicioAuth = inject(AuthService);

  const router = inject(Router);

  if (servicioAuth.sesionIniciada()) {
    return true;
  }
  return router.parseUrl('/login');
};
