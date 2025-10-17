import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const roleGuard: CanActivateFn = async (route: ActivatedRouteSnapshot) => {
  const roles = route.data['roles'] as string[];
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = await firstValueFrom(auth.getUser$());
  if (user && roles.includes(user.role)) return true;
  router.navigate(['/']);
  return false;
};
