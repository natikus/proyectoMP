import { CanActivateFn, Router } from '@angular/router';
import { ApiRestService } from '../servicios/api-rest.service';
import { inject } from '@angular/core';
import { AuthService } from '../servicios/auth.service';
export const logueadoGuard: CanActivateFn = (route, state) => {
  const apiService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  if (apiService.isValidUser()) {
    return true;
  }
  router.navigate(['/auth/login']);
  return false;
};
