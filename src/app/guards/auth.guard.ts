import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Auth } from '../services/auth';

/**
 * Guard d'authentification qui protège les routes
 * Redirige vers /forbidden si l'utilisateur n'est pas authentifié
 *
 * Exemple d'utilisation dans app.routes.ts:
 * { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] }
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(Auth);
  const router = inject(Router);

  // Vérifier si l'utilisateur est authentifié
  // Si l'utilisateur courant est déjà initialisé et authentifié -> OK
  if (authService.currentUserValue && authService.isAuthenticated()) {
    return true;
  }

  // Sinon, vérifier s'il y a un token valide en localStorage (cas de reload/initialisation)
  if (authService.isTokenValid()) {
    return true;
  }

  // Pas d'utilisateur connecté et pas de token valide -> rediriger vers forbidden
  router.navigate(['/forbidden']);
  return false;

  // L'utilisateur est authentifié, il peut accéder à toutes les routes
  return true;
};
