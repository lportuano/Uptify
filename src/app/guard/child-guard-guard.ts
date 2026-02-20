import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const childGuardGuard: CanActivateFn = (route, state) => {
  
  const servicioAuth = inject(AuthService);

  const router = inject(Router)

  if(servicioAuth.sesionIniciada()){
    return true;
  }
  return router.parseUrl('/login');
};
