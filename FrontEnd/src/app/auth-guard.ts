import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './services/auth-service';
import { inject } from '@angular/core';
import { map } from 'rxjs';


export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router)

  return authService.check_is_loggedin().pipe(
    map(isLogged => {
      if (isLogged) {
        return true;
      } else {
        return router.createUrlTree(['/login']);
      }
    })
  );
};