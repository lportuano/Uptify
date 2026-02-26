import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const authMatchGuard: CanMatchFn = (route, segments) => {
  const servicioAuth = inject(AuthService);
  const router = inject(Router);

  if (!servicioAuth.sesionIniciada()) {
    return router.parseUrl('/login');
  }

  if (route.data?.['role'] === 'ROLE_ADMIN' && servicioAuth.rolActual() !== 'ROLE_ADMIN') {
    return false;
  }

  return true;
};