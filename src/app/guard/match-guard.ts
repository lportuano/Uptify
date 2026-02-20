import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const authMatchGuard: CanMatchFn = (route, segments) => {

  const servicioAuth = inject(AuthService);
  
  const router = inject(Router);

  if (servicioAuth.sesionIniciada()) {
    return true;
  }
  return router.parseUrl('/login');
};